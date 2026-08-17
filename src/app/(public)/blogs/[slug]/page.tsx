import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
    getBlogBySlug,
    getRelatedBlogs,
} from "@/lib/dummy/blog";

import BlogHero from "@/components/blog-detail/blog-hero";
import ArticleLayout from "@/components/blog-detail/article-layout";
import AuthorCard from "@/components/blog-detail/author-card";
import ShareSection from "@/components/blog-detail/share-section";
import NewsletterCTASection from "@/components/blog/NewsletterCTASection";
import BlogFinalCTASection from "@/components/blog/BlogFinalCTASection";
import RelatedArticles from "@/components/blog-detail/related-articles";


interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { slug } = await params;

    const blog =
        getBlogBySlug(slug);

    if (!blog) {
        return {
            title: "Blog Not Found",
        };
    }

    return {
        title: blog.seoTitle,

        description:
            blog.metaDescription,

        openGraph: {
            title: blog.title,

            description:
                blog.metaDescription,

            images: [
                blog.featuredImage,
            ],
        },
    };
}

export default async function BlogDetailsPage({
    params,
}: Props) {
    const { slug } =
        await params;

    const blog =
        getBlogBySlug(slug);

    if (!blog) {
        notFound();
    }

    const related =
        getRelatedBlogs(slug);

    return (
        <>
            <BlogHero
                blog={blog}
            />

            <ArticleLayout
                blog={blog}
            />

            <AuthorCard
                author={
                    blog.author
                }
            />

            <ShareSection
                blog={blog}
            />

            <RelatedArticles
                blogs={related}
            />

            <NewsletterCTASection />

            <BlogFinalCTASection />
        </>
    );
}