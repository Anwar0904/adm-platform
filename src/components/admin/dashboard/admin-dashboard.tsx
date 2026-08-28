"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


import {
    ArrowUpRight,
    BriefcaseBusiness,
    FileText,
    ImageIcon,
    Users,
    Eye,
    TrendingUp,
    Clock3,
    CheckCircle2,
} from "lucide-react";
const quickActions = [
    {
        title: "Create Blog",
        description:
            "Publish a new article",
        href: "/admin/blogs/new",
        icon: FileText,
    },
    {
        title: "Add Project",
        description:
            "Update your portfolio",
        href: "/admin/portfolio/new",
        icon: ImageIcon,
    },
    {
        title: "View Consultations",
        description:
            "Manage client requests",
        href: "/admin/consultations",
        icon: BriefcaseBusiness,
    },
    {
        title: "Manage Team",
        description:
            "Update team members",
        href: "/admin/team",
        icon: Users,
    },
];

interface DashboardStats {
    totalLeads: number;
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

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalLeads: 0,
        consultations: 0,
        publishedBlogs: 0,
        portfolioProjects: 0,
    });

    const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch consultations (leads)
                const consultResponse = await fetch("/api/consultations?limit=1000", {
                    cache: "no-store",
                });
                const consultData = await consultResponse.json();
                const totalConsultations = consultData.data?.total || 0;

                // Fetch blogs
                const blogsResponse = await fetch("/api/blogs?limit=1000&status=published", {
                    cache: "no-store",
                });
                const blogsData = await blogsResponse.json();
                const publishedBlogs = blogsData.data?.total || 0;

                // Fetch portfolio
                const portfolioResponse = await fetch("/api/portfolio?limit=1000&status=published", {
                    cache: "no-store",
                });
                const portfolioData = await portfolioResponse.json();
                const portfolioProjects = portfolioData.data?.total || 0;

                setStats({
                    totalLeads: totalConsultations,
                    consultations: totalConsultations,
                    publishedBlogs: publishedBlogs,
                    portfolioProjects: portfolioProjects,
                });

                // Build recent activity from actual data
                const activities: RecentActivityItem[] = [];

                // Add recent consultations
                if (consultData.data?.data && Array.isArray(consultData.data.data)) {
                    (consultData.data.data as Array<Record<string, unknown>>).slice(0, 2).forEach((item) => {
                        activities.push({
                            title: `Consultation from ${getString(item.name, "Client")}`,
                            description: getPreview(item.message, "New consultation request"),
                            time: getTimeAgo(getString(item.createdAt)),
                            icon: BriefcaseBusiness,
                            status: getString(item.status, "New"),
                        });
                    });
                }

                // Add recent blogs
                if (blogsData.data?.data && Array.isArray(blogsData.data.data)) {
                    (blogsData.data.data as Array<Record<string, unknown>>).slice(0, 2).forEach((item) => {
                        const title = getString(item.title, "Untitled blog");

                        activities.push({
                            title: `Blog published: ${title}`,
                            description: getPreview(item.excerpt, title),
                            time: getTimeAgo(getString(item.publishedAt ?? item.createdAt)),
                            icon: FileText,
                            status: "Published",
                        });
                    });
                }

                // Add recent portfolio
                if (portfolioData.data?.data && Array.isArray(portfolioData.data.data)) {
                    (portfolioData.data.data as Array<Record<string, unknown>>).slice(0, 2).forEach((item) => {
                        const title = getString(item.title, "Untitled project");

                        activities.push({
                            title: `Portfolio: ${title}`,
                            description: getPreview(item.shortDescription, title),
                            time: getTimeAgo(getString(item.createdAt)),
                            icon: ImageIcon,
                            status: "Updated",
                        });
                    });
                }

                setRecentActivity(activities.slice(0, 4));
            } catch {
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatStats = (stats: DashboardStats) => [
        {
            label: "Total Leads",
            value: stats.totalLeads.toString(),
            change: "+12.8%",
            icon: Users,
            href: "/admin/consultations",
        },
        {
            label: "Consultations",
            value: stats.consultations.toString(),
            change: "+8.4%",
            icon: BriefcaseBusiness,
            href: "/admin/consultations",
        },
        {
            label: "Published Blogs",
            value: stats.publishedBlogs.toString(),
            change: "+5.2%",
            icon: FileText,
            href: "/admin/blogs",
        },
        {
            label: "Portfolio Projects",
            value: stats.portfolioProjects.toString(),
            change: "+3.1%",
            icon: ImageIcon,
            href: "/admin/portfolio",
        },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            {/* Header */}
            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        Overview
                    </p>

                    <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                        Good morning, Admin.
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                        Here&apos;s what&apos;s happening across
                        your ADM digital ecosystem.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm">
                    <Clock3 size={17} />
                    <span>Today</span>
                </div>
            </section>

            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {loading ? (
                    <div className="col-span-4 text-center text-sm text-slate-500">
                        Loading dashboard...
                    </div>
                ) : error ? (
                    <div className="col-span-4 text-center text-sm text-red-500">
                        {error}
                    </div>
                ) : (
                    formatStats(stats).map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <Link
                                key={stat.label}
                                href={stat.href}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Icon size={21} />
                                    </div>

                                    <ArrowUpRight
                                        size={18}
                                        className="text-slate-300 transition group-hover:text-blue-600"
                                    />
                                </div>

                                <div className="mt-6">
                                    <p className="text-sm font-medium text-slate-500">
                                        {stat.label}
                                    </p>

                                    <div className="mt-1 flex items-end gap-3">
                                        <p className="text-3xl font-black tracking-tight text-slate-900">
                                            {stat.value}
                                        </p>

                                        <span className="mb-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </section>

            {/* Main grid */}
            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                {/* Performance */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 p-6">
                        <div>
                            <h3 className="font-black text-slate-900">
                                Website Performance
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Overview of your digital presence
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600">
                            <TrendingUp size={15} />
                            18.6%
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex h-64 items-end gap-2 sm:gap-4">
                            {[42, 55, 48, 67, 61, 76, 69, 84, 72, 91, 82, 96].map(
                                (height, index) => (
                                    <div
                                        key={index}
                                        className="group flex h-full flex-1 items-end"
                                    >
                                        <div
                                            style={{
                                                height: `${height}%`,
                                            }}
                                            className="relative w-full rounded-t-lg bg-blue-100 transition-all group-hover:bg-blue-500"
                                        >
                                            <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white group-hover:block">
                                                {height}%
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="mt-4 flex justify-between text-xs font-medium text-slate-400">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                            <span>Jul</span>
                            <span>Aug</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <h3 className="font-black text-slate-900">
                            Quick Actions
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Frequently used actions
                        </p>
                    </div>

                    <div className="mt-6 space-y-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <Link
                                    key={action.title}
                                    href={action.href}
                                    className="group flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/50"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-blue-100 group-hover:text-blue-600">
                                        <Icon size={19} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-slate-900">
                                            {action.title}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {action.description}
                                        </p>
                                    </div>

                                    <ArrowUpRight
                                        size={17}
                                        className="text-slate-300 transition group-hover:text-blue-600"
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Bottom grid */}
            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                {/* Recent Activity */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 p-6">
                        <div>
                            <h3 className="font-black text-slate-900">
                                Recent Activity
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Latest changes across ADM
                            </p>
                        </div>

                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700">
                            View all
                        </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {loading ? (
                            <div className="p-5 text-center text-sm text-slate-500">
                                Loading activities...
                            </div>
                        ) : recentActivity.length === 0 ? (
                            <div className="p-5 text-center text-sm text-slate-500">
                                No recent activity yet
                            </div>
                        ) : (
                            recentActivity.map((activity) => {
                                const Icon = activity.icon;

                                return (
                                    <div
                                        key={activity.title}
                                        className="flex gap-4 p-5"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <Icon size={18} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm font-bold text-slate-900">
                                                    {activity.title}
                                                </p>

                                                <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                                                    {activity.status}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {activity.description}
                                            </p>

                                            <p className="mt-2 text-xs font-medium text-slate-400">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* System Status */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <h3 className="font-black text-slate-900">
                            System Status
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            ADM services overview
                        </p>
                    </div>

                    <div className="mt-6 space-y-3">
                        {[
                            "Website",
                            "Database",
                            "Authentication",
                            "API Services",
                        ].map((service) => (
                            <div
                                key={service}
                                className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                                    <span className="text-sm font-semibold text-slate-700">
                                        {service}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                    <CheckCircle2
                                        size={14}
                                    />

                                    Operational
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <Eye
                            size={18}
                            className="text-blue-600"
                        />

                        <p className="text-xs leading-5 text-blue-700">
                            Dashboard is now connected to
                            real ADM data. Stats and activity
                            are updated from your database.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

function getString(value: unknown, fallback = ""): string {
    return typeof value === "string" ? value : fallback;
}

function getPreview(value: unknown, fallback: string): string {
    const text = getString(value, fallback);
    return text.length > 50 ? `${text.substring(0, 50)}...` : text;
}

// Helper function to format time
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