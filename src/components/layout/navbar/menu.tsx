import {
    Briefcase,
    Smartphone,
    BrainCircuit,
    Palette,
    FolderKanban,
    Building2,
    Users,
    Newspaper,
    Phone,
    LucideIcon,
} from "lucide-react";

export type NavigationChild = {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
};

export type NavigationItem = {
    title: string;
    href: string;
    icon?: LucideIcon;
    mega?: boolean;
    items?: NavigationChild[];
};

export const navigation: NavigationItem[] = [
    {
        title: "Home",
        href: "/",
    },

    {
        title: "Services",
        href: "/services",
        mega: true,
        items: [
            {
                title: "Web Development",
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
                title: "AI Solutions",
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
        title: "Portfolio",
        href: "/portfolio",
        icon: FolderKanban,
    },

    {
        title: "Industries",
        href: "/industries",
        icon: Building2,
    },

    {
        title: "Team",
        href: "/team",
        icon: Users,
    },

    {
        title: "Blogs",
        href: "/blogs",
        icon: Newspaper,
    },

    {
        title: "Contact",
        href: "/contact",
        icon: Phone,
    },
];