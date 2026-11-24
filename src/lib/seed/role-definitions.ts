import { PERMISSIONS } from "@/constants/permissions";
import type { IRole } from "@/types/role.types";

type RoleDefinition = Pick<IRole, "name" | "description" | "permissions" | "isDefault">;

export const SUPER_ADMIN_ROLE_DEFINITION: RoleDefinition = {
    name: "super admin",
    description: "System Administrator",
    permissions: Object.values(PERMISSIONS),
    isDefault: false,
};

export const ROLE_DEFINITIONS: RoleDefinition[] = [
    SUPER_ADMIN_ROLE_DEFINITION,
    {
        name: "admin",
        description: "Administrator",
        permissions: [
            PERMISSIONS.USER_READ,
            PERMISSIONS.USER_CREATE,
            PERMISSIONS.USER_UPDATE,
            PERMISSIONS.BLOG_READ,
            PERMISSIONS.BLOG_CREATE,
            PERMISSIONS.BLOG_UPDATE,
        ],
        isDefault: false,
    },
    {
        name: "editor",
        permissions: [
            PERMISSIONS.BLOG_READ,
            PERMISSIONS.BLOG_CREATE,
            PERMISSIONS.BLOG_UPDATE,
        ],
        isDefault: true,
    },
];
