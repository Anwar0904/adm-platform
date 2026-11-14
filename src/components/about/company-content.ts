const sampleVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

export const companyMediaPoster = "/about/company-media-poster.svg";

export const companyMedia = {
    companyHero: sampleVideoUrl,
    companyOverview: sampleVideoUrl,
    technology: sampleVideoUrl,
    marketing: sampleVideoUrl,
    artificialIntelligence: sampleVideoUrl,
    data: sampleVideoUrl,
    selectedWork: sampleVideoUrl,
    closingCampaign: sampleVideoUrl,
} as const;

export const companyContent = {
    introduction:
        "Arazi Digital Media is a global Technology, Marketing, AI and Data company.",
    overviewHeading: "Building What's Next for the Digital Economy.",
    overviewDescription:
        "We bring technology, marketing, artificial intelligence and data together as connected capabilities to address evolving digital challenges.",
    overviewCompanyDescription:
        "Arazi Digital Media brings together Technology, Marketing, AI and Data as connected capabilities.",
    story: {
        status: "Draft copy - pending approval",
        text: "Our story is shaped by the ideas, people and work behind Arazi Digital Media.",
    },
    vision: {
        status: "Proposed statement - pending approval",
        text: "To contribute to a more connected and intelligent digital economy through the responsible advancement of technology, marketing, artificial intelligence and data.",
    },
    mission: {
        status: "Proposed statement - pending approval",
        text: "To bring technology, marketing, AI and data together to help businesses address evolving digital challenges and develop meaningful, practical solutions.",
    },
    selectedWorkHeading: "IDEAS INTO ACTION",
    selectedWork:
        "Explore work published in ADM's portfolio. No unverified project outcomes, client claims or performance statistics are presented here.",
    closing: {
        heading: "Let's Build What's Next.",
        description:
            "Have a challenge, an idea or an opportunity in mind? Let's explore what we can build together.",
    },
} as const;

export const companyCapabilities = [
    {
        id: "technology",
        number: "01",
        label: "TECHNOLOGY",
        title: "Technology",
        description:
            "Building digital foundations and technology-driven solutions.",
        media: companyMedia.technology,
        mediaPosition: "left",
    },
    {
        id: "marketing",
        number: "02",
        label: "MARKETING",
        title: "Marketing",
        description:
            "Connecting businesses with audiences through meaningful digital experiences.",
        media: companyMedia.marketing,
        mediaPosition: "right",
    },
    {
        id: "artificial-intelligence",
        number: "03",
        label: "AI",
        title: "Artificial Intelligence",
        description:
            "Exploring intelligent systems and practical applications of artificial intelligence.",
        media: companyMedia.artificialIntelligence,
        mediaPosition: "left",
    },
    {
        id: "data",
        number: "04",
        label: "DATA",
        title: "Data",
        description:
            "Supporting informed thinking and data-driven business opportunities.",
        media: companyMedia.data,
        mediaPosition: "right",
    },
] as const;
