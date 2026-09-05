import {
    Briefcase,
    FolderKanban,
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
        title: "Expertise",
        href: "/services",
        mega: true,
        items: [
            {
                title: "Full-Stack Development",
                description:
                    "Web products built from interface to deployment",
                href: "/services/web-development",
                icon: Briefcase,
            },
            {
                title: "Backend & APIs",
                description: "Reliable services, data, and integrations",
                href: "/services",
                icon: Briefcase,
            },
        ],
    },

    {
        title: "Projects",
        href: "/portfolio",
        icon: FolderKanban,
    },

    {
        title: "Writing",
        href: "/blogs",
        icon: Newspaper,
    },

    {
        title: "Contact",
        href: "/contact",
        icon: Phone,
    },
];