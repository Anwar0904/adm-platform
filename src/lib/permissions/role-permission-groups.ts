import { PERMISSIONS } from "@/constants/permissions";

export type RolePermissionGroup = {
    label: string;
    permissions: string[];
};

const RESOURCE_LABELS: Record<string, string> = {
    blog: "Blogs",
    user: "Users",
    role: "Roles",
    service: "Services",
    portfolio: "Portfolio",
    media: "Media",
    category: "Categories",
    tag: "Tags",
    industry: "Industries",
    page: "Pages",
    testimonial: "Testimonials",
    faq: "FAQs",
    team_member: "Team",
    lead: "Leads",
    consultation: "Consultations",
    settings: "Settings",
};

const ACTION_LABELS: Record<string, string> = {
    read: "Read",
    write: "Create",
    create: "Create",
    update: "Update",
    delete: "Delete",
    approve: "Approve",
    manage: "Manage",
};

function humanize(value: string) {
    return value
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function humanizePermission(permission: string) {
    const [resource, action] = permission.split(".");
    const resourceLabel = RESOURCE_LABELS[resource] ?? humanize(resource);
    const actionLabel = ACTION_LABELS[action] ?? humanize(action);

    return `${resourceLabel} ${actionLabel}`;
}

const groupsByResource = new Map<string, RolePermissionGroup>();

for (const permission of new Set(Object.values(PERMISSIONS))) {
    const resource = permission.split(".")[0];
    const group = groupsByResource.get(resource) ?? {
        label: RESOURCE_LABELS[resource] ?? humanize(resource),
        permissions: [],
    };

    group.permissions.push(permission);
    groupsByResource.set(resource, group);
}

export const ROLE_PERMISSION_GROUPS = [...groupsByResource.values()];

export const ROLE_ASSIGNABLE_PERMISSIONS = ROLE_PERMISSION_GROUPS.flatMap(
    (group) => group.permissions,
);
