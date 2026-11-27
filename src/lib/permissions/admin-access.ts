import { PERMISSIONS } from "@/constants/permissions";

export type AdminNavigationItem = {
    label: string;
    href: string;
    section: string;
    permission?: string;
};

export const ADMIN_NAVIGATION: AdminNavigationItem[] = [
    { section: "Overview", label: "Dashboard", href: "/admin/dashboard", permission: PERMISSIONS.SETTINGS_MANAGE },
    { section: "Content", label: "Media", href: "/admin/media", permission: PERMISSIONS.MEDIA_READ },
    { section: "Content", label: "Blogs", href: "/admin/blogs", permission: PERMISSIONS.BLOG_READ },
    { section: "Content", label: "Categories", href: "/admin/categories", permission: PERMISSIONS.CATEGORY_READ },
    { section: "Content", label: "Tags", href: "/admin/tags", permission: PERMISSIONS.TAG_READ },
    { section: "Content", label: "Services", href: "/admin/services", permission: PERMISSIONS.SERVICE_READ },
    { section: "Content", label: "Portfolio", href: "/admin/portfolio", permission: PERMISSIONS.PORTFOLIO_READ },
    { section: "Content", label: "Team", href: "/admin/team", permission: PERMISSIONS.TEAM_MEMBER_READ },
    { section: "Content", label: "Testimonials", href: "/admin/testimonials", permission: PERMISSIONS.TESTIMONIAL_READ },
    { section: "Content", label: "FAQs", href: "/admin/faqs", permission: PERMISSIONS.FAQ_READ },
    { section: "Business", label: "Consultations", href: "/admin/consultations", permission: PERMISSIONS.CONSULTATION_READ },
    { section: "Administration", label: "Users", href: "/admin/users", permission: PERMISSIONS.USER_READ },
    { section: "Administration", label: "Roles", href: "/admin/roles", permission: PERMISSIONS.ROLE_READ },
    { section: "Administration", label: "Settings", href: "/admin/settings", permission: PERMISSIONS.SETTINGS_MANAGE },
];

export function isSuperAdminRole(roleName: string | null | undefined) {
    return roleName?.trim().toLowerCase().replace(/[\s_-]+/g, "_") === "super_admin";
}

export function canAccessAdminPermission(
    permissions: readonly string[],
    permission: string | undefined,
    roleName?: string | null,
) {
    return isSuperAdminRole(roleName) || (!!permission && permissions.includes(permission));
}

export function canAccessAdminRoute(
    pathname: string,
    permissions: readonly string[],
    roleName?: string | null,
) {
    const item = ADMIN_NAVIGATION
        .filter((candidate) => pathname === candidate.href || pathname.startsWith(`${candidate.href}/`))
        .sort((left, right) => right.href.length - left.href.length)[0];

    return item ? canAccessAdminPermission(permissions, item.permission, roleName) : false;
}

export function getVisibleAdminNavigation(permissions: readonly string[], roleName?: string | null) {
    return ADMIN_NAVIGATION.filter((item) =>
        canAccessAdminPermission(permissions, item.permission, roleName),
    );
}

export function getFirstAuthorizedAdminRoute(permissions: readonly string[], roleName?: string | null) {
    return getVisibleAdminNavigation(permissions, roleName)[0]?.href ?? null;
}
