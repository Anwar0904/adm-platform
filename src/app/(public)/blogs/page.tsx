import AuthorSpotlightSection from "@/components/blog/AuthorSpotlightSection";
import BlogFAQSection from "@/components/blog/BlogFAQSection";
import BlogFinalCTASection from "@/components/blog/BlogFinalCTASection";
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import BlogHeroSection from "@/components/blog/BlogHeroSection";
import FeaturedArticlesSection from "@/components/blog/FeaturedArticlesSection";
import LatestArticlesSection from "@/components/blog/LatestArticlesSection";
import NewsletterCTASection from "@/components/blog/NewsletterCTASection";
import ReadingTopicsSection from "@/components/blog/ReadingTopicsSection";
import TrendingArticlesSection from "@/components/blog/TrendingArticlesSection";

export const metadata: Metadata = {
    title: "Insights on Technology, Marketing, AI & Data",
    description:
        "Read ADM insights on technology, digital marketing, artificial intelligence and data, with practical ideas for digital teams.",
    alternates: { canonical: `${SITE_URL}/blogs` },
    openGraph: {
        type: "website",
        title: "Insights on Technology, Marketing, AI & Data",
        description:
            "Practical perspectives from Arazi Digital Media on technology, marketing, AI and data.",
        url: `${SITE_URL}/blogs`,
    },
};

export default function BlogPage() {
    return (
        <>
            <BlogHeroSection />
            <FeaturedArticlesSection />
            <TrendingArticlesSection />
            <LatestArticlesSection />
            <NewsletterCTASection />
            <ReadingTopicsSection />
            <AuthorSpotlightSection />
            <BlogFAQSection />
            <BlogFinalCTASection />
        </>
    )
}
