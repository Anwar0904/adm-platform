import {
    BrainCircuit,
    Briefcase,
    Building2,
    FolderKanban,
    Leaf,
    Newspaper,
    Palette,
    Phone,
    Scale,
    Smartphone,
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
                title: "Digital Platforms & Engineering",
                description:
                    "Modern, scalable websites and web applications",
                href: "/services/web-development",
                icon: Briefcase,
            },
            {
                title: "Mobile Apps",
                description:
                    "High-quality Android and iOS applications",
                href: "/services/mobile-apps",
                icon: Smartphone,
            },
            {
                title: "AI & Intelligent Systems",
                description:
                    "AI-powered tools for modern businesses",
                href: "/services/ai-solutions",
                icon: BrainCircuit,
            },
            {
                title: "UI / UX Design",
                description:
                    "Beautiful and intuitive digital experiences",
                href: "/services/ui-ux",
                icon: Palette,
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
