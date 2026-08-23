import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
    const record = await PublicContentService.getBlogBySlug(slug);
    const blog = normalizeBlog(record.toJSON() as unknown as ApiBlog);

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