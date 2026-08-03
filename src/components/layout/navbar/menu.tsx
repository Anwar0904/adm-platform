import {
    Briefcase,
    FolderKanban,
    Building2,
    Users,
    Newspaper,
    Phone,
} from "lucide-react";

export const navigation = [
    {
        title: "Home",
        href: "/",
    },

    {
        title: "Services",
        mega: true,
        href:"/services",

        items: [
            {
                title: "Web Development",
                description:
                    "Modern scalable websites",
                href: "/services/web-development",
                icon: Briefcase,
            },

            {
                title: "Mobile Apps",
                description:
                    "Android & iOS solutions",
                href: "/services/mobile-apps",
                icon: Briefcase,
            },

            {
                title: "AI Solutions",
                description:
                    "AI powered business tools",
                href: "/services/ai-solutions",
                icon: Briefcase,
            },

            {
                title: "UI / UX Design",
                description:
                    "Beautiful user experiences",
                href: "/services/ui-ux",
                icon: Briefcase,
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
        title: "Blog",
        href: "/blog",
        icon: Newspaper,
    },

    {
        title: "Contact",
        href: "/contact",
        icon: Phone,
    },
];