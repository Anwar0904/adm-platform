import { PasswordService } from "@/lib/auth/bcrypt";
import { ApiError } from "@/lib/api/api-error";
import SessionRepository from "@/repositories/session.repository";
import { env } from "@/config/env";
import { RegisterInput, LoginInput } from "@/types/auth";

import { User } from "@/models/user.model";
import { Role } from "@/models/role.model";
import mongoose from "mongoose";
import { JwtService } from "@/lib/auth/jwt";
import { ResetTokenService } from "@/lib/auth/reset-token";
class AuthService {
    async register(data: RegisterInput) {
        const { name, email, password } = data;

        console.log("Connection readyState:", mongoose.connection.readyState);
        // Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            throw new ApiError(409, "Email already exists.");
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

        if (!defaultRole) {
            defaultRole = await Role.create({
                name: "user",
                description: "Default user",
                permissions: [],
                isDefault: true,
                status: "active",
            });
        }

        // Hash password
        const hashedPassword = await PasswordService.hash(password);

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: defaultRole._id,
        });

        return user;
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

        const roleId =
            typeof user.role === "object" && user.role !== null && "_id" in user.role
                ? user.role._id.toString()
                : String(user.role);

        const payload = {
            sub: user._id.toString(),
            userId: user._id.toString(),
            email: user.email,
            role: roleId,
        };

        const accessToken =
            JwtService.signAccessToken(payload);

        const refreshToken =
            JwtService.signRefreshToken(payload);

        const hashedRefreshToken =
            await PasswordService.hash(refreshToken);

        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        await SessionRepository.create({
            user: user._id,
            refreshToken: hashedRefreshToken,
            expiresAt,
            isRevoked: false,
        });
        user.lastLogin = new Date();

        await user.save();
        console.log("===== LOGIN RESULT =====");
        console.log({
            user,
            accessToken,
            refreshToken,
        });
        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    async refresh(
        refreshToken: string
    ) {
        // 1. Verify JWT

        const payload =
            JwtService.verifyRefreshToken(
                refreshToken
            );

        // 2. Find user

        const user = await User.findById(
            payload.sub
        ).populate("role");

        if (!user) {
            throw new ApiError(
                401,
                "Invalid refresh token."
            );
        }

        // 3. Find all active sessions

        const sessions =
            await SessionRepository.find({
                user: user._id,
                isRevoked: false,
            });

        // 4. Match refresh token

        let matchedSession = null;

        for (const session of sessions) {
            const matched =
                await PasswordService.compare(
                    refreshToken,
                    session.refreshToken
                );

            if (matched) {
                matchedSession = session;
                break;
            }
        }

        if (!matchedSession) {
            throw new ApiError(
                401,
                "Refresh session not found."
            );
        }

        // 5. Generate new tokens

        const roleId =
            typeof user.role === "object" &&
                user.role !== null &&
                "_id" in user.role
                ? String(user.role._id)
                : String(user.role);

        const jwtPayload = {
            userId: user._id.toString(),
            sub: user._id.toString(),
            email: user.email,
            role: roleId,
        };

        const newAccessToken =
            JwtService.signAccessToken(
                jwtPayload
            );

        const newRefreshToken =
            JwtService.signRefreshToken(
                jwtPayload
            );

        // 6. Rotate refresh token

        matchedSession.refreshToken =
            await PasswordService.hash(
                newRefreshToken
            );

        matchedSession.expiresAt =
            JwtService.getExpiryDate(
                env.JWT_REFRESH_EXPIRES
            );

        await matchedSession.save();

        return {
            accessToken:
                newAccessToken,
            refreshToken:
                newRefreshToken,
        };
    }

    async logout(
        refreshToken: string
    ) {
        const sessions =
            await SessionRepository.find({
                isRevoked: false,
            });

        let matchedSession = null;

        for (const session of sessions) {
            const matched =
                await PasswordService.compare(
                    refreshToken,
                    session.refreshToken
                );

            if (matched) {
                matchedSession = session;
                break;
            }
        }

        if (!matchedSession) {
            throw new ApiError(
                401,
                "Session not found."
            );
        }

        matchedSession.isRevoked = true;

        await matchedSession.save();

        return true;
    }

    async forgotPassword(email: string) {
        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        const token =
            ResetTokenService.generate();

        user.passwordResetToken = token;

        user.passwordResetExpires =
            ResetTokenService.expiry();

        await user.save();

        return {
            resetToken: token,
            expiresAt:
                user.passwordResetExpires,
        };
    }
}

export default new AuthService();