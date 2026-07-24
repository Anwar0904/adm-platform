
import { PERMISSIONS } from "@/constants/permissions";
import { roleRepository } from "@/repositories/role.repository";

export async function seedRoles() {
    const superAdmin =
        await roleRepository.findByName("Super Admin");

    if (!superAdmin) {
        await roleRepository.create({
            name: "Super Admin",
            description: "System Administrator",
            permissions: Object.values(PERMISSIONS),
            isDefault: false,
            status: "active",
        });
    }

    const admin =
        await roleRepository.findByName("Admin");

    if (!admin) {
        await roleRepository.create({
            name: "Admin",
            description: "Administrator",
            permissions: [
                PERMISSIONS.USER_READ,
                PERMISSIONS.USER_WRITE,
                PERMISSIONS.USER_UPDATE,
                PERMISSIONS.BLOG_READ,
                PERMISSIONS.BLOG_WRITE,
            ],
            isDefault: false,
            status: "active",
        });
    }

    const editor =
        await roleRepository.findByName("Editor");

    if (!editor) {
        await roleRepository.create({
            name: "Editor",
            permissions: [
                PERMISSIONS.BLOG_READ,
                PERMISSIONS.BLOG_WRITE,
                PERMISSIONS.BLOG_UPDATE,
            ],
            isDefault: true,
            status: "active",
        });
    }
}