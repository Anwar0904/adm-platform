
import { roleRepository } from "@/repositories/role.repository";
import { ROLE_DEFINITIONS } from "@/lib/seed/role-definitions";

export async function seedRoles() {
    for (const roleData of ROLE_DEFINITIONS) {
        const role =
            await roleRepository.findByName(roleData.name);

        if (role) {
            await roleRepository.updateById(role._id, {
                description: roleData.description,
                permissions: roleData.permissions,
                isDefault: roleData.isDefault,
                status: "active",
            });
        } else {
            await roleRepository.create({
                ...roleData,
                status: "active",
            });
        }
    }
}
