import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";

import { connectDB } from "@/lib/db";
import PublicContentService from "@/services/public-content.service";
import { normalizeBlog, type ApiBlog } from "@/lib/api/blog";

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

    await connectDB();
    let record;

    try {
        record = await PublicContentService.getBlogBySlug(slug);
    } catch {
        return {
            title: "Article unavailable | Arazi Digital Media",
            robots: { index: false, follow: true },
        };
    }

    if (!record) {
        return {
            title: "Article unavailable | Arazi Digital Media",
            robots: { index: false, follow: true },
        };
    }

    const blog = normalizeBlog(record.toJSON() as unknown as ApiBlog);

    if (!blog) {
        return {
            title: "Blog Not Found",
        };
    }

    const url = `${SITE_URL}/blogs/${blog.slug}`;
    const authorName = blog.author.name;
    const tagNames = blog.tags;

    return {
        title: blog.seoTitle || blog.title,

        alternates: { canonical: url },

        robots: { index: true, follow: true },

        description:
            blog.metaDescription || blog.excerpt,

        keywords: tagNames,

        authors: authorName ? [{ name: authorName }] : undefined,

        openGraph: {
            type: "article",
            title: blog.title,

            description:
                blog.metaDescription || blog.excerpt,

            url: url,

            images: blog.featuredImage ? [
                {
                    url: blog.featuredImage,
                    width: 1200,
                    height: 630,
                    alt: blog.title,
                }
            ] : [],

            publishedTime: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,

            tags: tagNames,
        },

        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: blog.metaDescription || blog.excerpt,
            images: blog.featuredImage ? [blog.featuredImage] : [],
            creator: authorName ? `@${authorName.replace(/\s+/g, '')}` : undefined,
        },
    };
}

export default async function BlogDetailsPage({
    params,
}: Props) {
    const { slug } =
        await params;

    await connectDB();
    let record;
    try {
        record = await PublicContentService.getBlogBySlug(slug);
    } catch {
        notFound();
    }

    const blog = normalizeBlog(record.toJSON() as unknown as ApiBlog);

    const relatedResult = await PublicContentService.getBlogs({
        page: 1,
        limit: 4,
    });
    const related = relatedResult.blogs
        .map((item) => normalizeBlog(item.toJSON() as unknown as ApiBlog))
        .filter((item) => item.slug !== slug);

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
