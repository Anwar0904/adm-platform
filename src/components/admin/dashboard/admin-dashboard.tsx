"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
    ArrowUpRight,
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    Eye,
    FileText,
    ImageIcon,
    TrendingUp,
    Users,

} from "lucide-react";

import { trackPageView } from "@/lib/analytics";

const quickActions = [
    {
        title: "Create Blog",
        description: "Publish a new article",
        href: "/admin/blogs/new",
        icon: FileText,
    },
    {
        title: "Add Project",
        description: "Update your portfolio",
        href: "/admin/portfolio/new",
        icon: ImageIcon,
    },
    {
        title: "View Consultations",
        description: "Manage client requests",
        href: "/admin/consultations",
        icon: BriefcaseBusiness,
    },
    {
        title: "Manage Team",
        description: "Update team members",
        href: "/admin/team",
        icon: Users,
    },
];

interface DashboardStats {
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    convertedLeads: number;
    consultations: number;
    publishedBlogs: number;
    portfolioProjects: number;
}

interface RecentActivityItem {
    title: string;
    description: string;
    time: string;
    icon: typeof Users;
    status: string;
}

type ResourceName = "leads" | "consultations" | "blogs" | "portfolio";

type ResourceHealth = Record<ResourceName, "operational" | "unavailable">;

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalLeads: 0,
        newLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        consultations: 0,
        publishedBlogs: 0,
        portfolioProjects: 0,
    });

    const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [resourceHealth, setResourceHealth] = useState<ResourceHealth>({
        leads: "unavailable",
        consultations: "unavailable",
        blogs: "unavailable",
        portfolio: "unavailable",
    });

    useEffect(() => {
        trackPageView("admin_dashboard_view");
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const results = await Promise.allSettled([
                    fetch("/api/leads?limit=100", { cache: "no-store", credentials: "include" }),
                    fetch("/api/consultations?limit=100", { cache: "no-store", credentials: "include" }),
                    fetch("/api/blogs?limit=100&status=published", { cache: "no-store", credentials: "include" }),
                    fetch("/api/portfolio?limit=100&status=published", { cache: "no-store", credentials: "include" }),
                ]);

                const responses = await Promise.all(
                    results.map(async (result) => {
                        if (result.status === "rejected") {
                            return { response: null, data: null };
                        }

                        try {
                            return {
                                response: result.value,
                                data: await result.value.json(),
                            };
                        } catch {
                            return { response: result.value, data: null };
                        }
                    })
                );

                const [leadResult, consultResult, blogsResult, portfolioResult] = responses;
                const leadData = leadResult.data ?? {};
                const consultData = consultResult.data ?? {};
                const blogsData = blogsResult.data ?? {};
                const portfolioData = portfolioResult.data ?? {};

                const health: ResourceHealth = {
                    leads: leadResult.response?.ok ? "operational" : "unavailable",
                    consultations: consultResult.response?.ok ? "operational" : "unavailable",
                    blogs: blogsResult.response?.ok ? "operational" : "unavailable",
                    portfolio: portfolioResult.response?.ok ? "operational" : "unavailable",
                };
                setResourceHealth(health);

                if (Object.values(health).every((status) => status === "unavailable")) {
                    throw new Error("Dashboard data is unavailable.");
                }

                const leadList = getArrayField(leadData, ["data.leads", "leads", "data"]) as Array<Record<string, unknown>>;
                const consultationList = getArrayField(consultData, ["data.consultations", "consultations", "data"]) as Array<Record<string, unknown>>;
                const blogList = getArrayField(blogsData, ["data.blogs", "blogs", "data"]) as Array<Record<string, unknown>>;
                const portfolioList = (getArrayField(portfolioData, ["data.data", "data", "projects"]) as Array<Record<string, unknown>>);

                const totalLeads = getTotalCount(leadData, ["data.pagination.total", "pagination.total", "data.total", "total"], leadList.length);
                const totalConsultations = getTotalCount(consultData, ["data.pagination.total", "pagination.total", "data.total", "total"], consultationList.length);
                const publishedBlogs = getTotalCount(blogsData, ["data.pagination.total", "pagination.total", "data.total", "total"], blogList.length);
                const portfolioProjects = getTotalCount(portfolioData, ["data.pagination.total", "pagination.total", "data.total", "total"], portfolioList.length);

                const newLeads = leadList.filter((lead) => getString(lead.status) === "new").length;
                const qualifiedLeads = leadList.filter((lead) => {
                    const status = getString(lead.status);
                    return ["qualified", "proposal_sent", "converted", "won"].includes(status);
                }).length;
                const convertedLeads = leadList.filter((lead) => {
                    const status = getString(lead.status);
                    return ["converted", "won"].includes(status);
                }).length;

                setStats({
                    totalLeads,
                    newLeads,
                    qualifiedLeads,
                    convertedLeads,
                    consultations: totalConsultations,
                    publishedBlogs,
                    portfolioProjects,
                });

                const activities: RecentActivityItem[] = [];

                leadList.slice(0, 2)
                    .forEach((item) => {
                        activities.push({
                            title: `New lead: ${getString(item.fullName, "Client")}`,
                            description: getPreview(item.message, "New inquiry received"),
                            time: getTimeAgo(getString(item.createdAt)),
                            icon: Users,
                            status: getString(item.status, "new"),
                        });
                    });

                consultationList.slice(0, 2)
                    .forEach((item) => {
                        activities.push({
                            title: `Consultation from ${getString(item.name, "Client")}`,
                            description: getPreview(item.message, "Consultation request"),
                            time: getTimeAgo(getString(item.createdAt)),
                            icon: BriefcaseBusiness,
                            status: getString(item.status, "Scheduled"),
                        });
                    });

                blogList.slice(0, 2)
                    .forEach((item) => {
                        const title = getString(item.title, "Untitled blog");
                        activities.push({
                            title: `Blog published: ${title}`,
                            description: getPreview(item.excerpt, title),
                            time: getTimeAgo(getString(item.publishedAt ?? item.createdAt)),
                            icon: FileText,
                            status: "Published",
                        });
                    });

                setRecentActivity(activities.slice(0, 4));
            } catch (error) {
                setError(error instanceof Error ? error.message : "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const conversionRate = useMemo(() => {
        if (!stats.totalLeads) return 0;
        return Math.round((stats.convertedLeads / stats.totalLeads) * 100);
    }, [stats]);

    const statCards = [
        {
            label: "Total Leads",
            value: stats.totalLeads.toString(),
            icon: Users,
            href: "/admin/consultations",
        },
        {
            label: "Qualified",
            value: stats.qualifiedLeads.toString(),
            icon: BriefcaseBusiness,
            href: "/admin/consultations",
        },
        {
            label: "New Inquiries",
            value: stats.newLeads.toString(),
            icon: FileText,
            href: "/admin/blogs",
        },
        {
            label: "Converted",
            value: stats.convertedLeads.toString(),
            icon: ImageIcon,
            href: "/admin/portfolio",
        },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-400">Overview</p>
                    <h2 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Good morning, Admin.
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                        Here&apos;s what&apos;s happening across your ADM digital ecosystem.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 shadow-sm">
                    <Clock3 size={17} />
                    <span>Today</span>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {loading ? (
                    <div className="col-span-4 text-center text-sm text-slate-400">Loading dashboard...</div>
                ) : error ? (
                    <div className="col-span-4 text-center text-sm text-red-400">{error}</div>
                ) : (
                    statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Link
                                key={stat.label}
                                href={stat.href}
                                className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-all hover:-translate-y-0.5 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-950/30"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                                        <Icon size={21} />
                                    </div>
                                    <ArrowUpRight size={18} className="text-slate-500 transition group-hover:text-blue-300" />
                                </div>

                                <div className="mt-6">
                                    <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                                    <div className="mt-1 flex items-end gap-3">
                                        <p className="text-3xl font-black tracking-tight text-white">{stat.value}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-800 p-6">
                        <div>
                            <h3 className="font-black text-white">Conversion Performance</h3>
                            <p className="mt-1 text-sm text-slate-400">Overall lead-to-client progress</p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400">
                            <TrendingUp size={15} />
                            {conversionRate}%
                        </div>
                    </div>

                    <div className="grid gap-4 p-6 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Lead rate</p>
                            <p className="mt-3 text-3xl font-black text-white">{conversionRate}%</p>
                            <p className="mt-2 text-sm text-slate-400">Converted from total inquiries</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Qualified</p>
                            <p className="mt-3 text-3xl font-black text-white">{stats.qualifiedLeads}</p>
                            <p className="mt-2 text-sm text-slate-400">High-intent opportunities</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Consultations</p>
                            <p className="mt-3 text-3xl font-black text-white">{stats.consultations}</p>
                            <p className="mt-2 text-sm text-slate-400">Booked discovery calls</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <div>
                        <h3 className="font-black text-white">Quick Actions</h3>
                        <p className="mt-1 text-sm text-slate-400">Frequently used actions</p>
                    </div>

                    <div className="mt-6 space-y-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.title}
                                    href={action.href}
                                    className="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-blue-500/50 hover:bg-slate-950"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 transition group-hover:bg-blue-500/15 group-hover:text-blue-300">
                                        <Icon size={19} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-white">{action.title}</p>
                                        <p className="mt-0.5 text-xs text-slate-400">{action.description}</p>
                                    </div>

                                    <ArrowUpRight size={17} className="text-slate-500 transition group-hover:text-blue-300" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-800 p-6">
                        <div>
                            <h3 className="font-black text-white">Recent Activity</h3>
                            <p className="mt-1 text-sm text-slate-400">Latest changes across ADM</p>
                        </div>
                        <button className="text-sm font-bold text-blue-300 hover:text-blue-200">View all</button>
                    </div>

                    <div className="divide-y divide-slate-800">
                        {loading ? (
                            <div className="p-5 text-center text-sm text-slate-400">Loading activities...</div>
                        ) : recentActivity.length === 0 ? (
                            <div className="p-5 text-center text-sm text-slate-400">No recent activity yet</div>
                        ) : (
                            recentActivity.map((activity) => {
                                const Icon = activity.icon;
                                return (
                                    <div key={`${activity.title}-${activity.time}`} className="flex gap-4 p-5">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                                            <Icon size={18} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm font-bold text-white">{activity.title}</p>
                                                <span className="w-fit rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-bold capitalize text-slate-300">
                                                    {activity.status}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm text-slate-400">{activity.description}</p>
                                            <p className="mt-2 text-xs font-medium text-slate-500">{activity.time}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <div>
                        <h3 className="font-black text-white">System Status</h3>
                        <p className="mt-1 text-sm text-slate-400">ADM services overview</p>
                    </div>

                    <div className="mt-6 space-y-3">
                        {[
                            { name: "Website", status: "Operational", healthy: true },
                            { name: "Database", status: "Observed via API", healthy: Object.values(resourceHealth).some((status) => status === "operational") },
                            { name: "Authentication", status: "Observed via API", healthy: Object.values(resourceHealth).some((status) => status === "operational") },
                            { name: "API Services", status: Object.values(resourceHealth).every((status) => status === "operational") ? "Operational" : "Partial outage", healthy: Object.values(resourceHealth).some((status) => status === "operational") },
                        ].map((service) => (
                            <div key={service.name} className="flex items-center justify-between rounded-xl bg-slate-950/60 p-4">
                                <div className="flex items-center gap-3">
                                    <span className={["h-2.5 w-2.5 rounded-full", service.healthy ? "bg-emerald-500" : "bg-amber-500"].join(" ")} />
                                    <span className="text-sm font-semibold text-slate-200">{service.name}</span>
                                </div>
                                <div className={["flex items-center gap-1.5 text-xs font-bold", service.healthy ? "text-emerald-400" : "text-amber-400"].join(" ")}>
                                    <CheckCircle2 size={14} />
                                    {service.status}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                        <Eye size={18} className="text-blue-300" />
                        <p className="text-xs leading-5 text-blue-200">
                            Dashboard is connected to real ADM data and updates as leads and consultations are recorded.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

function getArrayField(payload: Record<string, unknown> | null | undefined, paths: string[]): unknown[] {
    for (const path of paths) {
        const value = readPath(payload, path);
        if (Array.isArray(value)) return value;
    }

    return [];
}

function getTotalCount(payload: Record<string, unknown> | null | undefined, paths: string[], fallback = 0): number {
    for (const path of paths) {
        const value = readPath(payload, path);
        if (typeof value === "number" && Number.isFinite(value)) return value;
        if (typeof value === "string" && value.trim() !== "") {
            const parsed = Number(value);
            if (Number.isFinite(parsed)) return parsed;
        }
    }

    return fallback;
}

function readPath(payload: Record<string, unknown> | null | undefined, path: string): unknown {
    if (!payload) return undefined;

    const parts = path.split(".");
    let current: unknown = payload;

    for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
            current = (current as Record<string, unknown>)[part];
            continue;
        }

        return undefined;
    }

    return current;
}

function getString(value: unknown, fallback = ""): string {
    return typeof value === "string" ? value : fallback;
}

function getPreview(value: unknown, fallback: string): string {
    const text = getString(value, fallback);
    return text.length > 60 ? `${text.substring(0, 60)}...` : text;
}

function getTimeAgo(dateString: string): string {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

    return date.toLocaleDateString();
}
