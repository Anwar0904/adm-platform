import { SortOrder, Types } from "mongoose";

import { Blog } from "@/models/blog.model";

import { ApiError } from "@/lib/api/api-error";

import BlogRepository from "@/repositories/blog.repository";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";

import {
    CreateBlogInput,
    UpdateBlogInput,
    BlogQuery,
} from "@/types/blog.management";

import { generateSlug } from "@/utils/slugify";

class BlogService {

    async getBlogs(query: BlogQuery) {
        const page = Number(query.page ?? 1);

        const limit = Number(query.limit ?? 10);

        const filter: Record<string, unknown> = {
            isDeleted: false,
        };

        if (query.search) {
            filter.$text = {
                $search: query.search,
            };
        }

        if (query.category) {
            filter.category =
                new Types.ObjectId(
                    query.category
                );
        }

        if (query.author) {
            filter.author =
                new Types.ObjectId(
                    query.author
                );
        }

        if (query.tag) {
            filter.tags = {
                $in: [
                    new Types.ObjectId(
                        query.tag
                    ),
                ],
            };
        }

        if (query.status) {
            filter.status = query.status;
        }

        if (
            query.featured !== undefined
        ) {
            filter.featured =
                query.featured;
        }

        let sort: Record<
            string,
            SortOrder
        > = {
            createdAt: -1,
        };

        if (query.sort) {
            const field =
                query.sort.replace(
                    "-",
                    ""
                );

            const direction =
                query.sort.startsWith(
                    "-"
                )
                    ? -1
                    : 1;

            sort = {
                [field]: direction,
            };
        }

        const [blogs, total] =
            await Promise.all([
                BlogRepository.getBlogs(
                    filter,
                    page,
                    limit,
                    sort
                ),

                BlogRepository.countBlogs(
                    filter
                ),
            ]);

        return {
            blogs,

            pagination: {
                page,
                limit,
                total,
                totalPages:
                    Math.ceil(
                        total / limit
                    ),
            },
        };
    }

    async getBlogById(id: string) {
        const blog =
            await BlogRepository.findById(
                id
            );

        if (
            !blog ||
            blog.isDeleted
        ) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        return blog;
    }

    async createBlog(
        data: CreateBlogInput,
        userId: string
    ) {
        const slug =
            data.slug
                ? generateSlug(
                    data.slug
                )
                : generateSlug(
                    data.title
                );

        const exists =
            await BlogRepository.slugExists(
                slug
            );

        if (exists) {
            throw new ApiError(
                409,
                "Slug already exists."
            );
        }

        return BlogRepository.create({
            ...data,

            slug,

            category:
                new Types.ObjectId(
                    data.category
                ),

            author:
                new Types.ObjectId(
                    data.author
                ),

            featuredImage:
                data.featuredImage
                    ? new Types.ObjectId(
                        data.featuredImage
                    )
                    : null,

            gallery:
                data.gallery?.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                ) ?? [],

            tags:
                data.tags.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                ),

            createdBy:
                new Types.ObjectId(
                    userId
                ),

            updatedBy:
                new Types.ObjectId(
                    userId
                ),

            status:
                (data.status ??
                    CONTENT_STATUS.DRAFT) as ContentStatus,

            featured:
                data.featured ??
                false,

            views: 0,

            readingTime: Math.max(
                1,
                Math.ceil(
                    data.content.split(
                        /\s+/
                    ).length / 200
                )
            ),

            publishedAt:
                data.status ===
                    CONTENT_STATUS.PUBLISHED
                    ? new Date()
                    : null,

            isDeleted: false,

            deletedAt: null,
        });
    }

    async updateBlog(
        id: string,
        data: UpdateBlogInput,
        userId: string
    ) {
        const blog =
            await Blog.findById(id);

        if (
            !blog ||
            blog.isDeleted
        ) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        const slug =
            data.slug
                ? generateSlug(
                    data.slug
                )
                : data.title
                    ? generateSlug(
                        data.title
                    )
                    : blog.slug;

        const exists =
            await BlogRepository.slugExists(
                slug,
                id
            );

        if (exists) {
            throw new ApiError(
                409,
                "Slug already exists."
            );
        }

        if (data.title)
            blog.title =
                data.title;

        blog.slug = slug;

        if (
            data.excerpt !==
            undefined
        )
            blog.excerpt =
                data.excerpt;

        if (
            data.content !==
            undefined
        ) {
            blog.content =
                data.content;

            blog.readingTime =
                Math.max(
                    1,
                    Math.ceil(
                        data.content.split(
                            /\s+/
                        ).length /
                        200
                    )
                );
        }

        if (
            data.category
        ) {
            blog.category =
                new Types.ObjectId(
                    data.category
                );
        }

        if (
            data.author
        ) {
            blog.author =
                new Types.ObjectId(
                    data.author
                );
        }

        if (
            data.featuredImage !==
            undefined
        ) {
            blog.featuredImage =
                data.featuredImage
                    ? new Types.ObjectId(
                        data.featuredImage
                    )
                    : null;
        }

        if (data.gallery) {
            blog.gallery =
                data.gallery.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                );
        }

        if (data.tags) {
            blog.tags =
                data.tags.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                );
        }

        if (
            data.seo !==
            undefined
        )
            blog.seo = data.seo;

        if (
            data.faqs !==
            undefined
        )
            blog.faqs =
                data.faqs;

        if (
            data.featured !==
            undefined
        )
            blog.featured =
                data.featured;

        if (
            data.status !==
            undefined
        ) {
            blog.status =
                data.status as ContentStatus;

            if (
                data.status ===
                CONTENT_STATUS.PUBLISHED &&
                !blog.publishedAt
            ) {
                blog.publishedAt =
                    new Date();
            }
        }

        blog.updatedBy =
            new Types.ObjectId(
                userId
            );

        await blog.save();

        return blog;
    }

    async deleteBlog(id: string) {
        const blog =
            await Blog.findById(id);

        if (
            !blog ||
            blog.isDeleted
        ) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        blog.isDeleted = true;
        blog.deletedAt =
            new Date();

        await blog.save();

        return true;
    }

    async restoreBlog(id: string) {
        const blog =
            await Blog.findById(id);

        if (!blog) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        blog.isDeleted = false;
        blog.deletedAt = null;

        await blog.save();

        return blog;
    }

    async changeStatus(
        id: string,
        status: ContentStatus
    ) {
        const blog =
            await Blog.findById(id);

        if (!blog) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        blog.status = status;

        if (
            status ===
            CONTENT_STATUS.PUBLISHED &&
            !blog.publishedAt
        ) {
            blog.publishedAt =
                new Date();
        }

        await blog.save();

        return blog;
    }

    async toggleFeatured(
        id: string
    ) {
        const blog =
            await Blog.findById(id);

        if (!blog) {
            throw new ApiError(
                404,
                "Blog not found."
            );
        }

        blog.featured =
            !blog.featured;

        await blog.save();

        return blog;
    }

    async incrementViews(
        id: string
    ) {
        await BlogRepository.incrementViews(
            id
        );
    }
}

export default new BlogService();