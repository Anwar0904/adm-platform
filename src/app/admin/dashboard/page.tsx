import { redirect } from "next/navigation";

import AdminDashboard from "@/components/admin/dashboard/admin-dashboard";
import { connectDB } from "@/lib/db";
import { getAccessToken } from "@/lib/auth/auth-cookies";
import { getUserFromToken } from "@/lib/auth/get-user";
import { AuthorizationService } from "@/lib/auth/authorization";
import { PERMISSIONS } from "@/constants/permissions";
import DashboardService from "@/services/dashboard.service";
import { Lead } from "@/models/lead.model";
import { Consultation } from "@/models/consultation.model";
import { Portfolio } from "@/models/portfolio.model";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        redirect("/admin/login");
    }

    await connectDB();

    const user = await getUserFromToken(`Bearer ${accessToken}`);
    const role = user.role;

    if (
        typeof role !== "object" ||
        role === null ||
        !("name" in role) ||
        !("permissions" in role)
    ) {
        redirect("/admin/login");
    }

    if (!AuthorizationService.isSuperAdmin(String(role.name))) {
        AuthorizationService.hasPermission(
            role.permissions as string[],
            PERMISSIONS.SETTINGS_MANAGE
        );
    }

    const dashboard = await DashboardService.getDashboard();
    const [newLeads, qualifiedLeads, convertedLeads, consultations, portfolioProjects] =
        await Promise.all([
            Lead.countDocuments({ status: "new", isDeleted: false }),
            Lead.countDocuments({ status: { $in: ["qualified", "proposal_sent", "converted", "won"] }, isDeleted: false }),
            Lead.countDocuments({ status: { $in: ["converted", "won"] }, isDeleted: false }),
            Consultation.countDocuments({ isDeleted: false }),
            Portfolio.countDocuments({ status: "published", isDeleted: false }),
        ]);

    return (
        <AdminDashboard
            stats={{
                totalLeads: dashboard.cards.leads.value,
                newLeads,
                qualifiedLeads,
                convertedLeads,
                consultations,
                publishedBlogs: dashboard.contentStatus.find((item) => item.status === "published")?.count ?? 0,
                portfolioProjects,
            }}
            recentActivity={[
                ...dashboard.recentLeads.slice(0, 2).map((lead) => ({
                    title: `New lead: ${lead.fullName}`,
                    description: "New inquiry received",
                    time: getTimeAgo(lead.createdAt),
                    icon: "users" as const,
                    status: lead.status,
                })),
                ...dashboard.recentBlogs.slice(0, 2).map((blog) => ({
                    title: `Blog published: ${blog.title}`,
                    description: blog.title,
                    time: getTimeAgo(blog.createdAt),
                    icon: "file" as const,
                    status: "Published",
                })),
            ].slice(0, 4)}
            resourceHealth={{
                leads: "operational",
                consultations: "operational",
                blogs: "operational",
                portfolio: "operational",
            }}
            error={null}
        />
    );
}

function getTimeAgo(date: Date) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

    return new Date(date).toLocaleDateString();
}