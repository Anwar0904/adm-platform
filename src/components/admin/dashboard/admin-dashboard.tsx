"use client";

import Link from "next/link";

import {
    ArrowUpRight,
    BriefcaseBusiness,
    FileText,
    ImageIcon,
    MessageSquareQuote,
    Users,
    Eye,
    TrendingUp,
    Clock3,
    CheckCircle2,
} from "lucide-react";

const stats = [
    {
        label: "Total Leads",
        value: "248",
        change: "+12.8%",
        icon: Users,
        href: "/admin/consultations",
    },
    {
        label: "Consultations",
        value: "36",
        change: "+8.4%",
        icon: BriefcaseBusiness,
        href: "/admin/consultations",
    },
    {
        label: "Published Blogs",
        value: "42",
        change: "+5.2%",
        icon: FileText,
        href: "/admin/blogs",
    },
    {
        label: "Portfolio Projects",
        value: "28",
        change: "+3.1%",
        icon: ImageIcon,
        href: "/admin/portfolio",
    },
];

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

const recentActivity = [
    {
        title: "New consultation request",
        description:
            "A new client submitted a consultation request.",
        time: "12 minutes ago",
        icon: BriefcaseBusiness,
        status: "New",
    },
    {
        title: "Blog published",
        description:
            "Building Enterprise AI Applications in 2026",
        time: "2 hours ago",
        icon: FileText,
        status: "Published",
    },
    {
        title: "Portfolio updated",
        description:
            "ADM Digital Transformation Case Study",
        time: "Yesterday",
        icon: ImageIcon,
        status: "Updated",
    },
    {
        title: "Testimonial added",
        description:
            "A new client testimonial was submitted.",
        time: "Yesterday",
        icon: MessageSquareQuote,
        status: "New",
    },
];

export default function AdminDashboard() {
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
                        Here's what's happening across
                        your ADM digital ecosystem.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm">
                    <Clock3 size={17} />

                    <span>
                        Today
                    </span>
                </div>
            </section>

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
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
                })}
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
                        {recentActivity.map(
                            (activity) => {
                                const Icon =
                                    activity.icon;

                                return (
                                    <div
                                        key={
                                            activity.title
                                        }
                                        className="flex gap-4 p-5"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <Icon
                                                size={
                                                    18
                                                }
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm font-bold text-slate-900">
                                                    {
                                                        activity.title
                                                    }
                                                </p>

                                                <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                                                    {
                                                        activity.status
                                                    }
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {
                                                    activity.description
                                                }
                                            </p>

                                            <p className="mt-2 text-xs font-medium text-slate-400">
                                                {
                                                    activity.time
                                                }
                                            </p>
                                        </div>
                                    </div>
                                );
                            }
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
                            Dashboard analytics will be
                            connected to real ADM data in
                            the next development stage.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}