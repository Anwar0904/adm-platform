import { roleService } from "@/services/role/role.service";
import { NextRequest } from "next/server";


class RoleController {
    async create(req: NextRequest) {
        const body = await req.json();
        return roleService.createRole(body);
    }

    async findAll() {
        return roleService.getRoles();
    }

    async findById(id: string) {
        return roleService.getRoleById(id);
    }

    async update(req: NextRequest, id: string) {
        const body = await req.json();
        return roleService.updateRole(id, body);
    }

    async delete(id: string) {
        return roleService.deleteRole(id);
    }
}

export const roleController = new RoleController();