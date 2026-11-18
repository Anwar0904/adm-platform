import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import QueryClientProviderWrapper from "@/components/QueryClientProviderWrapper";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    alternates: {
        canonical: SITE_URL,
    },
    title: {
        default: "Arazi Digital Media | Technology, Marketing, AI & Data",
        template: "%s | Arazi Digital Media",
    },
    description:
        "Arazi Digital Media is a global technology, marketing, AI and data company helping organizations create demand, build digital products, understand performance and scale with confidence.",
    keywords: [
        "Arazi Digital Media",
        "technology company",
        "digital marketing",
        "search engine optimization",
        "software development",
        "artificial intelligence solutions",
        "workflow automation",
        "data analytics",
        "business intelligence",
    ],
    authors: [{ name: "Arazi Digital Media" }],
    creator: "Arazi Digital Media",
    publisher: "Arazi Digital Media",
    verification: {
        google: "2Vrpc5o8xq8NNajUgrM8GFAisW4WdLXtkliSC7Urk70",
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_URL,
        title: "ADM | Digital Company - AI-Powered Solutions",
        description:
            "Arazi Digital Media delivers intelligent digital solutions: AI automation, enterprise software, digital platforms, and UI/UX design.",
        siteName: "Arazi Digital Media",
    },
    twitter: {
        card: "summary_large_image",
        title: "ADM | Digital Company - AI-Powered Solutions",
        description:
            "Arazi Digital Media delivers intelligent digital solutions: AI automation, enterprise software, digital platforms, and UI/UX design.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            data-scroll-behavior="smooth"
        >
            <body className="app-shell">
                <QueryClientProviderWrapper>
                    {children}
                </QueryClientProviderWrapper>
                <Analytics />
            </body>
        </html>
    );
}
