"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    SESSION_ACTIVITY_DEBOUNCE_MS,
    SESSION_ACTIVITY_SYNC_INTERVAL_MS,
} from "@/constants/auth";

import {
    BarChart3,
    Bell,
    BookOpen,
    BriefcaseBusiness,
    ChevronDown,
    FileText,
    FolderKanban,
    ImageIcon,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquareQuote,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    ShieldCheck,
    Tags,
    Users,
    X,
} from "lucide-react";
import {
    ADMIN_NAVIGATION,
    canAccessAdminRoute,
    getVisibleAdminNavigation,
} from "@/lib/permissions/admin-access";

const navigationIcons = {
    "/admin/dashboard": LayoutDashboard,
    "/admin/media": ImageIcon,
    "/admin/blogs": BookOpen,
    "/admin/categories": FolderKanban,
    "/admin/tags": Tags,
    "/admin/services": BriefcaseBusiness,
    "/admin/portfolio": BarChart3,
    "/admin/team": Users,
    "/admin/testimonials": MessageSquareQuote,
    "/admin/faqs": FileText,
    "/admin/consultations": BriefcaseBusiness,
    "/admin/users": Users,
    "/admin/roles": ShieldCheck,
    "/admin/settings": Settings,
} as const;

type CurrentUser = {
    name?: string;
    email?: string;
    role?: { name: string | null; permissions: string[] };
};

type AuthorizationState = {
    path: string;
    status: "loading" | "ready" | "forbidden" | "error";
    user?: CurrentUser;
};

const EMPTY_PERMISSIONS: string[] = [];

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [authorization, setAuthorization] = useState<AuthorizationState>({
        path: "",
        status: "loading",
    });
    const [logoutError, setLogoutError] = useState(false);
    const [sessionRenewalError, setSessionRenewalError] = useState(false);

    useEffect(() => {
        if (pathname === "/admin/login") return;
        let active = true;

        void fetch("/api/auth/me", { cache: "no-store" })
            .then(async (response) => {
                if (!active) return;
                if (response.status === 401) {
                    router.replace("/admin/login");
                    return;
                }
                if (response.status === 403) {
                    setAuthorization({ path: pathname, status: "forbidden" });
                    return;
                }
                if (!response.ok) {
                    setAuthorization({ path: pathname, status: "error" });
                    return;
                }

                const result = await response.json() as {
                    data?: CurrentUser;
                };
                const user = result.data;
                if (!user || !Array.isArray(user.role?.permissions)) {
                    setAuthorization({ path: pathname, status: "error" });
                    return;
                }
                setAuthorization({ path: pathname, status: "ready", user });
            })
            .catch(() => {
                if (active) setAuthorization({ path: pathname, status: "error" });
            });

        return () => {
            active = false;
        };
    }, [pathname, router]);

    useEffect(() => {
        const timer = window.setTimeout(() => setSidebarOpen(false), 0);
        return () => window.clearTimeout(timer);
    }, [pathname]);

    useEffect(() => {
        if (pathname === "/admin/login") {
            return;
        }

        let lastActivityAt: number | undefined;
        let debounceTimer: number | undefined;
        let maxSyncTimer: number | undefined;
        let retryTimer: number | undefined;
        let retryScheduledFor: number | undefined;
        let refreshInFlight = false;

        const clearTimer = (timer: number | undefined) => {
            if (timer !== undefined) {
                window.clearTimeout(timer);
            }
        };

        const retrySoon = (activityAt: number) => {
            setSessionRenewalError(true);

            if (
                retryTimer !== undefined ||
                retryScheduledFor === activityAt
            ) {
                return;
            }

            retryScheduledFor = activityAt;
            retryTimer = window.setTimeout(() => {
                retryTimer = undefined;
                void syncActivity();
            }, 60_000);
        };

        const syncActivity = async () => {
            if (refreshInFlight || lastActivityAt === undefined) {
                return;
            }

            refreshInFlight = true;
            const activityAt = lastActivityAt;
            clearTimer(debounceTimer);
            clearTimer(maxSyncTimer);
            debounceTimer = undefined;
            maxSyncTimer = undefined;

            try {
                const sendActivityRequest = () =>
                    fetch("/api/auth/refresh", {
                        method: "POST",
                        cache: "no-store",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            activityAt: new Date(activityAt).toISOString(),
                        }),
                    });
                const response = navigator.locks
                    ? await navigator.locks.request(
                        "adm-auth-session",
                        sendActivityRequest
                    )
                    : await sendActivityRequest();

                if (response.ok) {
                    setSessionRenewalError(false);
                    retryScheduledFor = undefined;
                    clearTimer(retryTimer);
                    retryTimer = undefined;
                }

                if (response.status === 401 || response.status === 403) {
                    const userResponse = await fetch("/api/auth/me", {
                        cache: "no-store",
                    });

                    if (
                        userResponse.status === 401 ||
                        userResponse.status === 403
                    ) {
                        sessionStorage.removeItem("adm_user");
                        router.replace("/admin/login");
                        router.refresh();
                    } else if (userResponse.ok) {
                        setSessionRenewalError(false);
                        retryScheduledFor = undefined;
                    } else {
                        retrySoon(activityAt);
                    }
                } else if (!response.ok) {
                    retrySoon(activityAt);
                }
            } catch {
                retrySoon(activityAt);
            } finally {
                refreshInFlight = false;

                if (
                    lastActivityAt !== undefined &&
                    lastActivityAt > activityAt
                ) {
                    scheduleActivitySync();
                }
            }
        };

        const scheduleActivitySync = () => {
            clearTimer(debounceTimer);
            debounceTimer = window.setTimeout(() => {
                debounceTimer = undefined;
                void syncActivity();
            }, SESSION_ACTIVITY_DEBOUNCE_MS);

            if (maxSyncTimer === undefined) {
                maxSyncTimer = window.setTimeout(() => {
                    maxSyncTimer = undefined;
                    clearTimer(debounceTimer);
                    debounceTimer = undefined;
                    void syncActivity();
                }, SESSION_ACTIVITY_SYNC_INTERVAL_MS);
            }
        };

        const handleActivity = (event: Event) => {
            if (
                event.target instanceof Element &&
                event.target.closest("[data-session-refresh-ignore]")
            ) {
                return;
            }

            lastActivityAt = Date.now();

            if (retryTimer !== undefined) {
                clearTimer(retryTimer);
                retryTimer = undefined;
            }
            retryScheduledFor = undefined;
            scheduleActivitySync();
        };
        const activityEvents = [
            "pointerdown",
            "keydown",
            "touchstart",
            "wheel",
        ] as const;

        for (const eventName of activityEvents) {
            window.addEventListener(eventName, handleActivity, {
                passive: true,
            });
        }

        return () => {
            clearTimer(debounceTimer);
            clearTimer(maxSyncTimer);
            clearTimer(retryTimer);

            for (const eventName of activityEvents) {
                window.removeEventListener(eventName, handleActivity);
            }
        };
    }, [pathname, router]);

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    async function logout() {
        setLogoutError(false);

        try {
            const sendLogoutRequest = () =>
                fetch("/api/auth/logout", { method: "POST" });
            const response = navigator.locks
                ? await navigator.locks.request(
                    "adm-auth-session",
                    sendLogoutRequest
                )
                : await sendLogoutRequest();

            if (!response.ok && response.status !== 401) {
                setLogoutError(true);
                return;
            }

            sessionStorage.removeItem("adm_user");
            router.replace("/admin/login");
            router.refresh();
        } catch {
            setLogoutError(true);
        }
    }

    const user = authorization.path === pathname ? authorization.user : undefined;
    const permissions = user?.role?.permissions ?? EMPTY_PERMISSIONS;
    const roleName = user?.role?.name;
    const authorized = authorization.path === pathname && authorization.status === "ready" &&
        canAccessAdminRoute(pathname, permissions, roleName);
    const visibleNavigation = (() => {
        const visible = getVisibleAdminNavigation(permissions, roleName);
        return ["Overview", "Content", "Business", "Administration"].map((section) => ({
            label: section,
            items: visible.filter((item) => item.section === section),
        })).filter((section) => section.items.length > 0);
    })();
    const pageTitle = ADMIN_NAVIGATION.find(
        (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )?.label ?? "Admin";

    if (authorization.path !== pathname || authorization.status === "loading") {
        return <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-200" role="status">Checking administrator access…</div>;
    }

    if (authorization.status === "error") {
        return <div className="grid min-h-screen place-items-center bg-slate-950 p-6 text-slate-200"><p role="alert">Unable to verify administrator access. Refresh the page to try again.</p></div>;
    }

    if (authorization.status === "forbidden" || !authorized) {
        const firstAllowedRoute = visibleNavigation[0]?.items[0]?.href ?? "/admin/login";
        const returnLabel = firstAllowedRoute === "/admin/login" ? "Return to sign in" : "Open an available admin page";
        return <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-slate-200"><section className="max-w-lg text-center"><h1 className="text-2xl font-bold">Access denied</h1><p className="mt-3 text-slate-400">Your account does not have permission to open this page.</p><Link className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white" href={firstAllowedRoute}>{returnLabel}</Link></section></main>;
    }

    return (
        <div className="admin-shell min-h-screen bg-slate-950 text-slate-100">
            {sidebarOpen && (
                <button
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={[
                    "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-800 bg-slate-950/95 transition-all duration-300",
                    collapsed ? "w-[84px]" : "w-[270px]",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                ].join(" ")}
            >
                <div
                    className={[
                        "flex h-20 items-center border-b border-slate-800",
                        collapsed ? "justify-center px-3" : "justify-between px-5",
                    ].join(" ")}
                >
                    <Link href="/admin/dashboard" className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/30">
                            A
                        </span>

                        {!collapsed && (
                            <div>
                                <span className="block font-black tracking-tight text-white">ADM</span>
                                <span className="block text-[10px] font-medium text-slate-400">
                                    CONTROL CENTER
                                </span>
                            </div>
                        )}
                    </Link>

                    {!collapsed && (
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-5">
                    {visibleNavigation.map((section) => (
                        <div key={section.label} className="mb-6">
                            {!collapsed && (
                                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                    {section.label}
                                </p>
                            )}

                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = navigationIcons[item.href as keyof typeof navigationIcons];
                                    const active =
                                        pathname === item.href || pathname.startsWith(`${item.href}/`);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={collapsed ? item.label : undefined}
                                            className={[
                                                "group flex items-center rounded-xl py-3 text-sm font-semibold transition-all",
                                                collapsed ? "justify-center px-3" : "gap-3 px-3",
                                                active
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                                            ].join(" ")}
                                        >
                                            <Icon
                                                size={19}
                                                className={
                                                    active
                                                        ? "text-white"
                                                        : "text-slate-400 group-hover:text-blue-400"
                                                }
                                            />

                                            {!collapsed && <span>{item.label}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="hidden border-t border-slate-800 p-3 lg:block">
                    <button
                        onClick={() => setCollapsed((value) => !value)}
                        className="flex w-full items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                        {collapsed ? (
                            <PanelLeftOpen size={19} />
                        ) : (
                            <>
                                <PanelLeftClose size={19} />
                                <span>Collapse</span>
                            </>
                        )}
                    </button>
                </div>

                {!collapsed && (
                    <div className="border-t border-slate-800 p-4">
                        {logoutError && (
                            <p
                                role="alert"
                                className="mb-3 text-xs text-red-300"
                            >
                                Unable to sign out. Please try again.
                            </p>
                        )}
                        <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/15 font-bold text-blue-300">
                                {user?.name?.charAt(0).toUpperCase() || "A"}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-white">
                                    {user?.name || "Administrator"}
                                </p>
                                <p className="truncate text-xs text-slate-400">
                                    {user?.email || "Admin account"}
                                </p>
                            </div>

                            <button
                                onClick={logout}
                                data-session-refresh-ignore
                                title="Sign out"
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
                            >
                                <LogOut size={17} />
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            <div
                className={[
                    "min-h-screen transition-all duration-300",
                    collapsed ? "lg:pl-[84px]" : "lg:pl-[270px]",
                ].join(" ")}
            >
                <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
                    <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-xl p-2.5 text-slate-300 hover:bg-slate-800 lg:hidden"
                                aria-label="Open sidebar"
                            >
                                <Menu size={21} />
                            </button>

                            <div className="min-w-0">
                                <p className="hidden text-xs font-medium text-slate-400 sm:block">ADM Admin</p>
                                <h1 className="truncate text-xl font-black text-white">{pageTitle}</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                className="relative rounded-xl p-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                aria-label="Notifications"
                            >
                                <Bell size={20} />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-slate-950" />
                            </button>

                            <div className="hidden h-8 w-px bg-slate-700 sm:block" />

                            <button className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-800">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-300">
                                    {user?.name?.charAt(0).toUpperCase() || "A"}
                                </span>
                                <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="p-4 sm:p-6 lg:p-8">
                    {sessionRenewalError && (
                        <p
                            role="status"
                            className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
                        >
                            Session renewal is temporarily unavailable. Your page will stay open while we retry.
                        </p>
                    )}
                    <div className="rounded-[28px] border border-slate-800 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/30 sm:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
