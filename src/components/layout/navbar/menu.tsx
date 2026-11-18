import {
    BrainCircuit,
    BarChart3,
    Briefcase,
    Building2,
    Code2,
    FolderKanban,
    Leaf,
    Megaphone,
    Newspaper,
    Phone,
    Scale,
    Users,
    type LucideIcon,
} from "lucide-react";
import { publicRoutes } from "@/config/site";

export type NavigationChild = {
    title: string;
    description?: string;
    href: string;
    icon?: LucideIcon;
};

type NavigationLink = {
    title: string;
    href: string;
    icon?: LucideIcon;
    primary?: boolean;
    mega?: false;
    items?: never;
};

type NavigationDropdown = {
    title: string;
    href?: string;
    icon?: LucideIcon;
    mega: true;
    items: NavigationChild[];
};

export type NavigationItem = NavigationLink | NavigationDropdown;

export const navigation: NavigationItem[] = [
    {
        title: "Home",
        href: "/",
    },
    {
        title: "About",
        icon: Users,
        mega: true,
        items: [
            {
                title: "Our Company",
                href: "/about",
                icon: Building2,
            },
            {
                title: "Leadership & Governance",
                href: "/about/leadership-governance",
                icon: Scale,
            },
            {
                title: "Sustainability",
                href: "/about/sustainability",
                icon: Leaf,
            },
            {
                title: "Careers",
                href: publicRoutes.careers,
                icon: Briefcase,
            },
        ],
    },
    {
        title: "Capabilities",
        href: "/services",
        mega: true,
        items: [
            {
                title: "Technology",
                description:
                    "Digital platforms, software and engineering",
                href: "/services/technology",
                icon: Code2,
            },
            {
                title: "Marketing",
                description:
                    "SEO, paid media, social media and content",
                href: "/services/marketing",
                icon: Megaphone,
            },
            {
                title: "AI",
                description:
                    "Applied AI, agents, integrations and automation",
                href: "/services/ai",
                icon: BrainCircuit,
            },
            {
                title: "Data",
                description:
                    "Analytics, business intelligence and reporting",
                href: "/services/data",
                icon: BarChart3,
            },
        ],
    },
    {
        title: "Industries",
        href: "/industries",
        icon: Building2,
    },
    {
        title: "Selected Work",
        href: "/portfolio",
        icon: FolderKanban,
    },
    {
        title: "Insights",
        href: "/blogs",
        icon: Newspaper,
    },
    {
        title: "Talk to ADM",
        href: "/contact",
        icon: Phone,
        primary: true,
    },
];
