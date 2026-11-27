import assert from "node:assert/strict";
import test from "node:test";

import { PERMISSIONS, PermissionValues } from "@/constants/permissions";
import { roleRepository } from "@/repositories/role.repository";
import { roleService } from "@/services/role/role.service";
import { ROLE_ASSIGNABLE_PERMISSIONS, ROLE_PERMISSION_GROUPS } from "./role-permission-groups";
import { CreateRoleSchema } from "@/validators/role.validator";

test("every permission shown in the Roles UI is accepted by CreateRoleSchema", () => {
    assert.deepEqual(
        [...ROLE_ASSIGNABLE_PERMISSIONS].sort(),
        [...PermissionValues].sort(),
    );

    for (const permission of ROLE_PERMISSION_GROUPS.flatMap((group) => group.permissions)) {
        assert.doesNotThrow(() => CreateRoleSchema.parse({
            name: "permission-check",
            permissions: [permission],
        }), `UI permission ${permission} must be accepted by the backend schema`);
    }
});

test("creates staging_viewer with only canonical USER_READ permission", async (context) => {
    context.mock.method(roleRepository, "findByName", async () => null);
    context.mock.method(
        roleRepository,
        "create",
        async (roleData: Parameters<typeof roleRepository.create>[0]) => roleData as never,
    );

    const input = CreateRoleSchema.parse({
        name: "staging_viewer",
        permissions: [PERMISSIONS.USER_READ],
    });
    const createdRole = await roleService.createRole(input);
    const createdPermissions: string[] = [...createdRole.permissions];
    const permissionSet = new Set<string>(createdPermissions);

    assert.equal(createdRole.name, "staging_viewer");
    assert.deepEqual(createdPermissions, [PERMISSIONS.USER_READ]);
    assert.equal(permissionSet.has(PERMISSIONS.USER_CREATE), false);
    assert.equal(permissionSet.has(PERMISSIONS.USER_UPDATE), false);
    assert.equal(permissionSet.has(PERMISSIONS.USER_DELETE), false);
    assert.equal(permissionSet.has(PERMISSIONS.ROLE_READ), false);
    assert.equal(permissionSet.has(PERMISSIONS.ROLE_CREATE), false);
    assert.equal(permissionSet.has(PERMISSIONS.ROLE_UPDATE), false);
    assert.equal(permissionSet.has(PERMISSIONS.ROLE_DELETE), false);
});
