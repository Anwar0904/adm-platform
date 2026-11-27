import { PasswordService } from "@/lib/auth/bcrypt";
import { ApiError } from "@/lib/api/api-error";
import SessionRepository from "@/repositories/session.repository";
import { RegisterInput, LoginInput } from "@/types/auth";
import { User } from "@/models/user.model";
import { Role } from "@/models/role.model";
import mongoose from "mongoose";
import { createHash } from "node:crypto";
import {
    getSessionExpiresAt,
    normalizeSessionActivityAt,
} from "@/lib/auth/session-policy";
import { JwtService } from "@/lib/auth/jwt";
import { ResetTokenService } from "@/lib/auth/reset-token";
import { ResetPasswordInput } from "@/validators/auth";
import { ChangePasswordInput } from "@/validators/auth/change-password.validator";
import { AuthEmailDeliveryError, AuthEmailService } from "@/services/auth/auth-email.service";

function logAuthEmailFailure(kind: "reset" | "verification" | "registration", error: unknown) {
    const code = error instanceof AuthEmailDeliveryError ? error.code : "provider-failed";
    console.error("auth-email-delivery-failed", { kind, code });
}

export function clearEmailVerificationFields(user: {
    emailVerificationToken?: string | null;
    emailVerificationExpires?: Date | null;
}) {
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
}

async function findActiveRefreshSession(
    refreshToken: string,
    payload: ReturnType<typeof JwtService.verifyRefreshToken>,
    now: Date
) {
    if (!payload.userId || payload.sub !== payload.userId) {
        throw new ApiError(401, "Invalid refresh token.");
    }

    const sessions = payload.sid
        ? mongoose.Types.ObjectId.isValid(payload.sid)
            ? await SessionRepository.findActiveSessionById(
                payload.sid,
                payload.userId,
                now
            ).then((session) => session ? [session] : [])
            : []
        : await SessionRepository.find({
            user: payload.userId,
            isRevoked: false,
            expiresAt: { $gt: now },
        });

    for (const session of sessions) {
        if (
            await PasswordService.compare(
                refreshToken,
                session.refreshToken
            )
        ) {
            return session;
        }
    }

    if (payload.sid && sessions.length > 0) {
        throw new ApiError(
            409,
            "Refresh token was rotated by another request."
        );
    }

    throw new ApiError(401, "Refresh session not found or expired.");
}

async function getActiveRefreshSession(
    refreshToken: string,
    now: Date
) {
    let payload: ReturnType<typeof JwtService.verifyRefreshToken>;

    try {
        payload = JwtService.verifyRefreshToken(refreshToken);
    } catch {
        throw new ApiError(401, "Invalid or expired refresh token.");
    }

    const session = await findActiveRefreshSession(
        refreshToken,
        payload,
        now
    );
    if (!session) {
        throw new ApiError(401, "Refresh session not found or expired.");
    }
    const user = await User.findById(payload.userId).populate("role");

    if (!user || user.isDeleted || user.status !== "active") {
        throw new ApiError(401, "User account is inactive.");
    }

    return { payload, session, user };
}

function getSessionJwtPayload(
    session: { _id: mongoose.Types.ObjectId },
    user: {
        _id: mongoose.Types.ObjectId;
        email: string;
        role: unknown;
    }
) {
    const roleId =
        typeof user.role === "object" &&
            user.role !== null &&
            "_id" in user.role
            ? String(user.role._id)
            : String(user.role);

    return {
        userId: user._id.toString(),
        sub: user._id.toString(),
        email: user.email,
        role: roleId,
        sid: session._id.toString(),
    };
}

class AuthService {
    async register(data: RegisterInput) {
        const { name, email, password } = data;
        const nameParts = name.trim().split(/\s+/);
        const firstName = nameParts[0] ?? name;
        const lastName = nameParts.slice(1).join(" ");

        // Registration remains disabled at the route by default. This service still
        // avoids returning a duplicate-account signal if an owner enables it.
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            await PasswordService.hash(password);
            return false;
        }

        // Find the default role (User)
        let defaultRole = await Role.findOne({
            isDefault: true,
        });

        if (!defaultRole) {
            defaultRole = await Role.findOne({
                name: { $regex: /^user$/i },
            });
        }

        if (!defaultRole) throw new ApiError(503, "Registration is unavailable.");
        if (
            !Array.isArray(defaultRole.permissions) ||
            defaultRole.permissions.length !== 0 ||
            /admin|super.?admin/i.test(defaultRole.name)
        ) {
            throw new ApiError(503, "Registration is unavailable.");
        }

        // Hash password
        const hashedPassword =
            await PasswordService.hash(password);

        // Generate verification token
        const verificationToken =
            ResetTokenService.generate();

        const hashedVerificationToken =
            ResetTokenService.hash(
                verificationToken
            );

        // Create user
        let user;
        try {
            user = await User.create({
                firstName,
                lastName,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: defaultRole._id,
                emailVerified: false,
                emailVerificationToken: hashedVerificationToken,
                emailVerificationExpires: ResetTokenService.expiry(),
            });
        } catch (error) {
            if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
                return false;
            }
            throw error;
        }

        const tokenHash = ResetTokenService.hash(verificationToken);
        try {
            await AuthEmailService.sendVerification(user.email, verificationToken);
        } catch (error) {
            await User.deleteOne({
                _id: user._id,
                emailVerificationToken: tokenHash,
            });
            if (error instanceof AuthEmailDeliveryError) {
                logAuthEmailFailure("registration", error);
                return false;
            }
            throw error;
        }

        return true;

    }

    async login(data: LoginInput) {
        const { email, password } = data;

        // Find user by email
        const user = await User.findOne({
            email: email.toLowerCase(),
        })
            .select("+password")
            .populate("role");

        if (!user || !user.password) {
            throw new ApiError(
                401,
                "Invalid email or password."
            );
        }

        // Compare password
        const isPasswordValid =
            await PasswordService.compare(
                password,
                user.password
            );

        if (!isPasswordValid) {
            throw new ApiError(
                401,
                "Invalid email or password."
            );
        }

        // Account deleted
        if (user.isDeleted) {
            throw new ApiError(
                403,
                "This account no longer exists."
            );
        }

        // Account disabled
        if (user.status !== "active") {
            throw new ApiError(
                403,
                "Your account has been disabled."
            );
        }

        if (!user.emailVerified && !user.isEmailVerified) {
            throw new ApiError(
                403,
                "Please verify your email first."
            );
        }

        // Extract Role ID
        const roleId =
            typeof user.role === "object" &&
                user.role !== null &&
                "_id" in user.role
                ? user.role._id.toString()
                : String(user.role);

        const now = new Date();
        const sessionStartedAt = normalizeSessionActivityAt(now);
        const sessionId = new mongoose.Types.ObjectId();

        const payload = {
            sub: user._id.toString(),
            userId: user._id.toString(),
            email: user.email,
            role: roleId,
            sid: sessionId.toString(),
        };

        const accessToken =
            JwtService.signAccessToken(payload, now);

        const refreshToken =
            JwtService.signRefreshToken(
                payload,
                sessionStartedAt
            );

        const hashedRefreshToken =
            await PasswordService.hash(refreshToken);

        await SessionRepository.createSession(sessionId, {
            user: user._id,
            refreshToken: hashedRefreshToken,
            expiresAt: getSessionExpiresAt(sessionStartedAt),
            lastActivityAt: sessionStartedAt,
            lastUsedAt: sessionStartedAt,
            isRevoked: false,
            userAgent: "",
            ipAddress: "",
        });

        user.lastLogin = now;
        await user.save();

        return {
            user,
            sessionExpiresAt: getSessionExpiresAt(sessionStartedAt),
            tokens: {
                accessToken,
                refreshToken,
            },
        };
    }

    async getUserFromRefreshToken(
        refreshToken: string,
        now = new Date()
    ) {
        const { user } = await getActiveRefreshSession(
            refreshToken,
            now
        );

        return user;
    }

    async refresh(
        refreshToken: string,
        activityAt: Date,
        now = new Date()
    ) {
        const { session, user } = await getActiveRefreshSession(
            refreshToken,
            now
        );
        if (
            !(activityAt instanceof Date) ||
            !Number.isFinite(activityAt.getTime())
        ) {
            throw new ApiError(400, "Invalid activity timestamp.");
        }

        if (activityAt.getTime() > now.getTime() + 5_000) {
            throw new ApiError(400, "Activity timestamp is in the future.");
        }

        const normalizedActivityAt = normalizeSessionActivityAt(
            activityAt.getTime() > now.getTime()
                ? now
                : activityAt
        );
        const previousActivityAt =
            session.lastActivityAt ??
            session.lastUsedAt ??
            session.createdAt;

        if (
            normalizedActivityAt.getTime() <=
            previousActivityAt.getTime()
        ) {
            const accessToken = JwtService.signAccessToken(
                getSessionJwtPayload(session, user),
                now
            );

            return {
                accessToken,
                refreshToken: undefined,
                sessionExpiresAt: session.expiresAt,
            };
        }

        const sessionExpiresAt =
            getSessionExpiresAt(normalizedActivityAt);
        const updatedSession =
            await SessionRepository.recordSessionActivity(
                session._id,
                user._id.toString(),
                normalizedActivityAt,
                sessionExpiresAt,
                now
            );

        if (!updatedSession) {
            throw new ApiError(
                401,
                "Refresh session is no longer active."
            );
        }

        if (
            updatedSession.lastActivityAt &&
            updatedSession.lastActivityAt.getTime() >
                normalizedActivityAt.getTime()
        ) {
            throw new ApiError(
                409,
                "A newer activity update was already recorded."
            );
        }

        const jwtPayload = getSessionJwtPayload(session, user);

        const accessToken =
            JwtService.signAccessToken(jwtPayload, now);
        const nextRefreshToken =
            JwtService.signRefreshToken(
                jwtPayload,
                normalizedActivityAt
            );
        const nextHash =
            await PasswordService.hash(nextRefreshToken);
        const rotatedSession =
            await SessionRepository.rotateRefreshToken(
                session._id,
                session.refreshToken,
                nextHash,
                now,
                sessionExpiresAt,
                normalizedActivityAt
            );

        if (!rotatedSession) {
            throw new ApiError(
                409,
                "Refresh token was rotated by another request."
            );
        }

        return {
            accessToken,
            refreshToken: nextRefreshToken,
            sessionExpiresAt: rotatedSession.expiresAt,
        };
    }

    async refreshAccessToken(
        refreshToken: string,
        now = new Date()
    ) {
        const { session, user } = await getActiveRefreshSession(
            refreshToken,
            now
        );

        return {
            accessToken: JwtService.signAccessToken(
                getSessionJwtPayload(session, user),
                now
            ),
        };
    }

    async logout(
        refreshToken: string
    ) {
        let payload;

        try {
            payload = JwtService.verifyRefreshToken(refreshToken);
        } catch {
            throw new ApiError(401, "Invalid or expired refresh token.");
        }

        if (!payload?.userId || payload.sub !== payload.userId) {
            throw new ApiError(401, "Invalid refresh token.");
        }

        if (payload.sid) {
            if (!mongoose.Types.ObjectId.isValid(payload.sid)) {
                throw new ApiError(401, "Invalid session.");
            }

            const session = await SessionRepository.findActiveSessionById(
                payload.sid,
                payload.userId,
            );
            if (!session) {
                throw new ApiError(401, "Session is no longer active.");
            }

            const isCurrentRefreshToken = await PasswordService.compare(
                refreshToken,
                session.refreshToken,
            );
            if (!isCurrentRefreshToken) {
                throw new ApiError(401, "Invalid refresh token.");
            }

            const revoked =
                await SessionRepository.revokeActiveSession(
                    session._id,
                    session.refreshToken,
                );

            if (!revoked) {
                throw new ApiError(401, "Session is no longer active.");
            }

            return true;
        }

        const sessions = await SessionRepository.find({
                user: payload.userId,
                isRevoked: false,
            });

        let matchedSession;
        for (const session of sessions) {
            if (
                await PasswordService.compare(
                    refreshToken,
                    session.refreshToken
                )
            ) {
                matchedSession = session;
                break;
            }
        }

        if (!matchedSession) {
            throw new ApiError(401, "Session not found.");
        }

        const revoked =
            await SessionRepository.revokeActiveSession(
                matchedSession._id,
                matchedSession.refreshToken
            );

        if (!revoked) {
            throw new ApiError(401, "Session is no longer active.");
        }

        return true;
    }

    async forgotPassword(email: string) {
        const user = await User.findOne({
            email: email.toLowerCase(),
            status: "active",
            isDeleted: { $ne: true },
        });

        if (!user) {
            return;
        }

        const resetToken = ResetTokenService.generate();
        const hashedToken = ResetTokenService.hash(resetToken);
        const expiresAt = ResetTokenService.expiry();
        const updated = await User.findOneAndUpdate(
            { _id: user._id, status: "active", isDeleted: { $ne: true } },
            { $set: { passwordResetToken: hashedToken, passwordResetExpires: expiresAt } },
            { new: true },
        ).select("email");
        if (!updated) return;

        try {
            await AuthEmailService.sendPasswordReset(updated.email, resetToken);
        } catch (error) {
            await User.updateOne(
                { _id: updated._id, passwordResetToken: hashedToken },
                { $unset: { passwordResetToken: 1, passwordResetExpires: 1 } },
            );
            logAuthEmailFailure("reset", error);
        }
    }

    async resetPassword(data: ResetPasswordInput) {
        const { token, password } = data;

        // Hash incoming token
        const hashedToken = createHash("sha256")
            .update(token)
            .digest("hex");

        const now = new Date();
        const passwordHash = await PasswordService.hash(password);
        const user = await User.findOneAndUpdate(
            {
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: now },
                status: "active",
                isDeleted: { $ne: true },
            },
            {
                $set: { password: passwordHash, passwordChangedAt: now },
                $unset: { passwordResetToken: 1, passwordResetExpires: 1 },
            },
            { new: true },
        ).select("_id");

        if (!user) throw new ApiError(400, "Invalid or expired reset token.");

        // Revoke every active session
        await SessionRepository.revokeAllUserSessions(user._id.toString());

        return true;
    }

    async changePassword(
        userId: string,
        data: ChangePasswordInput
    ) {
        const {
            currentPassword,
            newPassword,
        } = data;

        // Find user
        const user = await User.findById(userId)
            .select("+password");

        if (!user || !user.password) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        // Verify current password
        const isCurrentPasswordValid =
            await PasswordService.compare(
                currentPassword,
                user.password
            );

        if (!isCurrentPasswordValid) {
            throw new ApiError(
                400,
                "Current password is incorrect."
            );
        }

        // Prevent reusing the same password
        const isSamePassword =
            await PasswordService.compare(
                newPassword,
                user.password
            );

        if (isSamePassword) {
            throw new ApiError(
                400,
                "New password must be different from the current password."
            );
        }

        // Hash and save new password
        user.password =
            await PasswordService.hash(
                newPassword
            );
        user.passwordChangedAt = new Date();

        // Clear any outstanding reset tokens
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        // Revoke every active session
        await SessionRepository.updateMany(
            {
                user: user._id,
                isRevoked: false,
            },
            {
                isRevoked: true,
                lastUsedAt: new Date(),
            }
        );

        return true;
    }

    async verifyEmail(token: string) {
        const hashedToken = ResetTokenService.hash(token);
        const user = await User.findOneAndUpdate(
            {
                emailVerificationToken: hashedToken,
                emailVerificationExpires: { $gt: new Date() },
                emailVerified: { $ne: true },
                isEmailVerified: { $ne: true },
                isDeleted: { $ne: true },
            },
            {
                $set: { emailVerified: true, isEmailVerified: true },
                $unset: { emailVerificationToken: 1, emailVerificationExpires: 1 },
            },
            { new: true },
        ).select("_id");

        if (!user) throw new ApiError(400, "Invalid or expired verification token.");
        return true;
    }

    async resendVerificationEmail(email: string) {
        const user = await User.findOne({
            email: email.toLowerCase(),
            isDeleted: { $ne: true },
        });

        if (!user || user.emailVerified || user.isEmailVerified) return;

        const verificationToken =
            ResetTokenService.generate();

        const tokenHash = ResetTokenService.hash(verificationToken);
        const expiresAt = ResetTokenService.expiry();
        const updated = await User.findOneAndUpdate(
            { _id: user._id, emailVerified: { $ne: true }, isEmailVerified: { $ne: true }, isDeleted: { $ne: true } },
            { $set: { emailVerificationToken: tokenHash, emailVerificationExpires: expiresAt } },
            { new: true },
        ).select("email");
        if (!updated) return;

        try {
            await AuthEmailService.sendVerification(updated.email, verificationToken);
        } catch (error) {
            await User.updateOne(
                { _id: updated._id, emailVerificationToken: tokenHash },
                { $unset: { emailVerificationToken: 1, emailVerificationExpires: 1 } },
            );
            logAuthEmailFailure("verification", error);
        }
    }

}

export default new AuthService();
