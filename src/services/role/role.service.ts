import { roleRepository } from "@/repositories/role.repository";
import { IRole } from "@/types/role.types";
import { Types } from "mongoose";

class RoleService {
    async createRole(data: Partial<IRole>) {
        const exists = await roleRepository.findByName(data.name!);

        if (exists) {
            throw new Error("Role already exists.");
        }

        return roleRepository.create(data);
    }

    async getRoles() {
        return roleRepository.findMany();
    }

    async getRoleById(id: string | Types.ObjectId) {
        const role = await roleRepository.findById(id);

        if (!role) {
            throw new Error("Role not found.");
        }

        return role;
    }

    async updateRole(
        id: string | Types.ObjectId,
        data: Partial<IRole>
    ) {
        const role = await roleRepository.findById(id);

        if (!role) {
            throw new Error("Role not found.");
        }

        if (
            data.name &&
            data.name !== role.name
        ) {
            const exists =
                await roleRepository.findByName(data.name);

            if (exists) {
                throw new Error("Role name already exists.");
            }
        }

        return roleRepository.updateById(id, data);
    }

    async deleteRole(id: string | Types.ObjectId) {
        const role = await roleRepository.findById(id);

        if (!role) {
            throw new Error("Role not found.");
        }

        if (role.isDefault) {
            throw new Error("Default role cannot be deleted.");
        }

        return roleRepository.deleteById(id);
    }

    async assignPermissions(
        id: string | Types.ObjectId,
        permissions: string[]
    ) {
        const role = await roleRepository.findById(id);

        if (!role) {
            throw new Error("Role not found.");
        }

        return roleRepository.updateById(id, {
            permissions,
        });
    }

    async getDefaultRole() {
        return roleRepository.findDefaultRole();
    }

    async findByName(name: string) {
        return roleRepository.findByName(name);
    }
}

export const roleService = new RoleService();