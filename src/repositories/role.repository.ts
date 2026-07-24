import { Role } from "@/models/role.model";
import { BaseRepository } from "@/repositories/base.repository";
import { IRole } from "@/types/role.types";


export class RoleRepository extends BaseRepository<IRole> {
    constructor() {
        super(Role);
    }

    async findByName(name: string) {
        return this.model.findOne({ name });
    }

    async findDefaultRole() {
        return this.model.findOne({ isDefault: true });
    }
}

export const roleRepository = new RoleRepository();