"use client";

import { useEffect, useMemo } from "react";
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
    icon: "users" | "briefcase" | "file";
    status: string;
}

type ResourceName = "leads" | "consultations" | "blogs" | "portfolio";

type ResourceHealth = Record<ResourceName, "operational" | "unavailable">;

export interface AdminDashboardData {
    stats: DashboardStats;
    recentActivity: RecentActivityItem[];
    resourceHealth: ResourceHealth;
    error: string | null;
}

export default function AdminDashboard({
    stats,
    recentActivity,
    resourceHealth,
    error,
}: AdminDashboardData) {

    const activityIcons = {
        users: Users,
        briefcase: BriefcaseBusiness,
        file: FileText,
    } as const;

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
                {error ? (
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
                        {recentActivity.length === 0 ? (
                            <div className="p-5 text-center text-sm text-slate-400">No recent activity yet</div>
                        ) : (
                            recentActivity.map((activity) => {
                                const Icon = activityIcons[activity.icon];
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
