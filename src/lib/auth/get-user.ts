import { User } from "@/models/user.model";
import { JwtService } from "@/lib/auth/jwt";
import { ApiError } from "@/lib/api/api-error";

export async function getUserFromToken(
    authorization?: string | null
) {
    if (!authorization) {
        throw new ApiError(
            401,
            "Authorization header is missing."
        );
    }

    if (!authorization.startsWith("Bearer ")) {
        throw new ApiError(
            401,
            "Invalid authorization format."
        );
    }

    const token = authorization.split(" ")[1];

    if (!token) {
        throw new ApiError(
            401,
            "Access token is missing."
        );
    }

    let payload;

    try {
        payload =
            JwtService.verifyAccessToken(token);
    } catch {
        throw new ApiError(
            401,
            "Invalid or expired access token."
        );
    }

    const user = await User.findById(payload.userId)
        .populate("role")
        .select("-password");

    if (!user) {
        throw new ApiError(
            401,
            "User not found."
        );
    }

    if (user.isDeleted) {
        throw new ApiError(
            401,
            "User account has been deleted."
        );
    }

    if (user.status !== "active") {
        throw new ApiError(
            403,
            "User account is inactive."
        );
    }

    return user;
}