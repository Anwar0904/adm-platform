import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { PERMISSIONS } from "@/constants/permissions";
import {
    ADMIN_NAVIGATION,
    canAccessAdminRoute,
    getFirstAuthorizedAdminRoute,
    getVisibleAdminNavigation,
} from "@/lib/permissions/admin-access";

test("staging_viewer navigation and direct route access are limited to user.read", () => {
    const permissions = [PERMISSIONS.USER_READ];
    const links = getVisibleAdminNavigation(permissions, "staging_viewer");

    assert.deepEqual(links.map((item) => item.href), ["/admin/users"]);
    assert.equal(canAccessAdminRoute("/admin/users", permissions, "staging_viewer"), true);
    assert.equal(canAccessAdminRoute("/admin/testimonials", permissions, "staging_viewer"), false);
    assert.equal(canAccessAdminRoute("/admin/roles", permissions, "staging_viewer"), false);
});

test("Super Admin can access all canonical admin navigation routes", () => {
    for (const item of ADMIN_NAVIGATION) {
        assert.equal(canAccessAdminRoute(item.href, [], "Super Admin"), true, item.href);
    }
});

test("dashboard denial redirects a restricted administrator to the first permitted page", async () => {
    assert.equal(getFirstAuthorizedAdminRoute([PERMISSIONS.USER_READ], "staging_viewer"), "/admin/users");
    assert.equal(getFirstAuthorizedAdminRoute([], "limited_role"), null);
    assert.equal(getFirstAuthorizedAdminRoute([], "Super Admin"), "/admin/dashboard");

    const dashboard = await readFile(new URL("../../app/admin/dashboard/page.tsx", import.meta.url), "utf8");
    assert.match(dashboard, /redirect\(getFirstAuthorizedAdminRoute/);
    assert.doesNotMatch(dashboard, /hasPermission\([\s\S]*SETTINGS_MANAGE/);
});

test("admin permission guard reads trusted auth API state and does not trust sessionStorage", async () => {
    const source = await readFile(new URL("../../components/admin/layout/admin-shell.tsx", import.meta.url), "utf8");
    assert.match(source, /fetch\("\/api\/auth\/me"/);
    assert.doesNotMatch(source, /sessionStorage\.getItem\(["']adm_user/);
    assert.match(source, /canAccessAdminRoute\(pathname, permissions, roleName\)/);
});

test("each admin navigation item has a canonical permission identifier", () => {
    const canonical = new Set<string>(Object.values(PERMISSIONS));
    for (const item of ADMIN_NAVIGATION) {
        assert.ok(item.permission && canonical.has(item.permission), `${item.href} needs a canonical permission`);
    }
});
