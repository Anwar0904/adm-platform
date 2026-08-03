// src/lib/dummy/blog.ts

export type BlogCategory =
    | "Artificial Intelligence"
    | "Web Development"
    | "Next.js"
    | "UI / UX"
    | "Cloud"
    | "DevOps"
    | "Blockchain"
    | "Digital Marketing"
    | "Case Studies"
    | "Company News";

export interface Author {
    id: string;
    name: string;
    role: string;
    avatar: string;
}

export interface BlogPost {
    id: string;
    slug: string;

    title: string;
    excerpt: string;
    content?: string;

    coverImage: string;

    featured: boolean;
    trending: boolean;

    category: BlogCategory;
    tags: string[];

    readingTime: number;

    publishedAt: string;

    author: Author;

    views: number;
}

export const blogCategories: BlogCategory[] = [
    "Artificial Intelligence",
    "Web Development",
    "Next.js",
    "UI / UX",
    "Cloud",
    "DevOps",
    "Blockchain",
    "Digital Marketing",
    "Case Studies",
    "Company News",
];

export const blogAuthors: Author[] = [
    {
        id: "1",
        name: "Sarah Johnson",
        role: "AI Research Lead",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    },
    {
        id: "2",
        name: "Michael Chen",
        role: "Senior Full Stack Engineer",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    },
    {
        id: "3",
        name: "Emma Wilson",
        role: "UI/UX Director",
        avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    },
    {
        id: "4",
        name: "David Miller",
        role: "Cloud Architect",
        avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    },
];

export const blogPosts: BlogPost[] = [
    {
        id: "1",
        slug: "building-enterprise-ai-applications",

        title: "Building Enterprise AI Applications in 2026",

        excerpt:
            "Discover the architecture, tools and best practices behind scalable enterprise AI systems.",

        coverImage:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&q=80",

        featured: true,
        trending: true,

        category: "Artificial Intelligence",

        tags: [
            "AI",
            "LLMs",
            "Enterprise",
        ],

        readingTime: 8,

        publishedAt: "2026-07-25",

        author: blogAuthors[0],

        views: 8250,
    },

    {
        id: "2",
        slug: "nextjs-best-practices",

        title: "Next.js 16 Best Practices Every Developer Should Know",

        excerpt:
            "Performance optimization, routing strategy and production deployment tips.",

        coverImage:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=80",

        featured: false,
        trending: true,

        category: "Next.js",

        tags: [
            "Next.js",
            "SSR",
            "Performance",
        ],

        readingTime: 6,

        publishedAt: "2026-07-20",

        author: blogAuthors[1],

        views: 6400,
    },

    {
        id: "3",
        slug: "modern-ui-design-principles",

        title: "Modern UI Design Principles That Increase Conversion",

        excerpt:
            "Learn how premium interfaces improve usability and business growth.",

        coverImage:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400&q=80",

        featured: false,
        trending: false,

        category: "UI / UX",

        tags: [
            "UI",
            "UX",
            "Design",
        ],

        readingTime: 7,

        publishedAt: "2026-07-15",

        author: blogAuthors[2],

        views: 4100,
    },

    {
        id: "4",
        slug: "future-of-cloud-native-development",

        title: "Cloud Native Development: The Future of Scalable Software",

        excerpt:
            "Containers, Kubernetes and cloud infrastructure explained in a practical way.",

        coverImage:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80",

        featured: false,
        trending: false,

        category: "Cloud",

        tags: [
            "Cloud",
            "Docker",
            "Kubernetes",
        ],

        readingTime: 9,

        publishedAt: "2026-07-10",

        author: blogAuthors[3],

        views: 3200,
    },

    {
        id: "5",
        slug: "how-adm-builds-digital-products",

        title: "Inside ADM: How We Deliver Premium Digital Products",

        excerpt:
            "A behind-the-scenes look into our design and engineering workflow.",

        coverImage:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80",

        featured: false,
        trending: false,

        category: "Company News",

        tags: [
            "Culture",
            "ADM",
            "Process",
        ],

        readingTime: 5,

        publishedAt: "2026-07-05",

        author: blogAuthors[1],

        views: 1800,
    },

    {
        id: "6",
        slug: "smart-blockchain-solutions",

        title: "Smart Blockchain Solutions Beyond Cryptocurrency",

        excerpt:
            "Explore real-world blockchain use cases for enterprises and startups.",

        coverImage:
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1400&q=80",

        featured: false,
        trending: false,

        category: "Blockchain",

        tags: [
            "Blockchain",
            "Web3",
            "Solidity",
        ],

        readingTime: 10,

        publishedAt: "2026-06-30",

        author: blogAuthors[0],

        views: 3900,
    },
];