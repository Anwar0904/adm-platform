export const profile = {
    name: process.env.NEXT_PUBLIC_PROFILE_NAME ?? "Your Name",
    title: process.env.NEXT_PUBLIC_PROFILE_TITLE ?? "Full-Stack Developer & IT Student",
    shortIntroduction:
        process.env.NEXT_PUBLIC_PROFILE_INTRO ??
        "I build modern web applications, backend systems, APIs, admin dashboards, and mobile applications.",
    bio: "I am a full-stack developer and IT student focused on building modern web applications, backend systems, APIs, admin dashboards, and mobile applications. I am especially interested in becoming a highly skilled professional full-stack developer with strong capabilities across web, backend, mobile, and modern application development.",
    location: process.env.NEXT_PUBLIC_PROFILE_LOCATION ?? "Available remotely",
    email: process.env.NEXT_PUBLIC_PROFILE_EMAIL ?? "your.email@example.com",
    phone: process.env.NEXT_PUBLIC_PROFILE_PHONE ?? "",
    profileImage: process.env.NEXT_PUBLIC_PROFILE_IMAGE ?? "/home/profile.jpg",
    resumeUrl: process.env.NEXT_PUBLIC_PROFILE_RESUME_URL ?? "",
    availability:
        process.env.NEXT_PUBLIC_PROFILE_AVAILABILITY ??
        "Available for selected projects",
    focusAreas: [
        "Full-stack web applications",
        "Backend systems and REST APIs",
        "Admin dashboards and CMS platforms",
        "Database-driven business applications",
        "Cross-platform mobile applications",
    ],
    expertise: [
        {
            title: "Full-Stack Development",
            description: "MERN-style and Next.js applications, TypeScript systems, CRUD platforms, dashboards, and CMS-style products.",
            technologies: ["Next.js", "React", "TypeScript", "Node.js", "MongoDB", "MySQL"],
        },
        {
            title: "Web Application Development",
            description: "Responsive business applications, modern interfaces, component architecture, and Figma-to-code implementation.",
            technologies: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Bootstrap", "Figma"],
        },
        {
            title: "Backend & API Development",
            description: "REST APIs, server-side development, authentication, authorization, role-based access control, and database architecture.",
            technologies: ["Node.js", "Express.js", "REST APIs", "Mongoose", "MongoDB", "MySQL"],
        },
        {
            title: "Mobile App Development",
            description: "Cross-platform, API-integrated mobile applications built with React Native and TypeScript.",
            technologies: ["React Native", "TypeScript", "API integration"],
        },
        {
            title: "WordPress Development",
            description: "Business websites and content-driven experiences using WordPress and Elementor Pro.",
            technologies: ["WordPress", "Elementor Pro", "PHP"],
        },
        {
            title: "Web3 Development",
            description: "Smart-contract and Ethereum application development with Solidity and Hardhat.",
            technologies: ["Solidity", "Hardhat", "Ethereum"],
        },
    ],
    technologyGroups: [
        { name: "Frontend", technologies: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Bootstrap"] },
        { name: "Backend", technologies: ["Node.js", "Express.js", "REST APIs", "Authentication", "Authorization", "RBAC"] },
        { name: "Databases", technologies: ["MongoDB", "Mongoose", "MySQL"] },
        { name: "Mobile", technologies: ["React Native", "TypeScript", "API-integrated apps"] },
        { name: "CMS & Web3", technologies: ["WordPress", "Elementor Pro", "PHP", "Solidity", "Hardhat", "Ethereum"] },
        { name: "Tools", technologies: ["Git", "GitHub", "Linux", "Figma"] },
    ],
    socialLinks: {
        github: process.env.NEXT_PUBLIC_PROFILE_GITHUB ?? "",
        linkedin: process.env.NEXT_PUBLIC_PROFILE_LINKEDIN ?? "",
    },
    seo: {
        title: process.env.NEXT_PUBLIC_PROFILE_SEO_TITLE ?? "Your Name - Full-Stack Developer & IT Student",
        description:
            process.env.NEXT_PUBLIC_PROFILE_SEO_DESCRIPTION ??
            "Personal portfolio of a full-stack developer and IT student building modern web, backend, API, admin dashboard, and mobile applications.",
    },
} as const;