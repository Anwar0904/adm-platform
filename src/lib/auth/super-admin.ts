import { ApiError } from "@/lib/api/api-error";

type RoleLike =
    | string
    | {
        name?: string;
    }
    | null
    | undefined;

export function isSuperAdmin(
    role: RoleLike
): boolean {
    const roleName =
        typeof role === "string"
            ? role
            : role?.name;

    return (
        roleName?.toLowerCase() ===
        "super_admin"
    );
}

export function requireSuperAdmin(
    role: RoleLike
) {
    if (!isSuperAdmin(role)) {
        throw new ApiError(
            403,
            "Super Admin access required."
        );
    }
}