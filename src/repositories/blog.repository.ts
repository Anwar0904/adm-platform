import {
    SortOrder,
    Types,
} from "mongoose";

import { Blog } from "@/models/blog.model";
import { IBlog } from "@/types/blog.types";

class BlogRepository {
    async create(
        data: Partial<IBlog>
    ) {
        return Blog.create(data);
    }

    async findById(id: string) {
        return Blog.findById(id)
            .populate(
                "category",
                "name slug"
            )
            .populate(
                "tags",
                "name slug color"
            )
            .populate(
                "author",
                "name email avatar"
            )
            .populate(
                "featuredImage"
            )
            .populate(
                "gallery"
            )
            .populate(
                "createdBy",
                "name email"
            )
            .populate(
                "updatedBy",
                "name email"
            );
    }

    async findBySlug(
        slug: string
    ) {
        return Blog.findOne({
            slug,
            isDeleted: false,
        });
    }

    async slugExists(
        slug: string,
        excludeId?: string
    ) {
        const filter: {
            slug: string;
            isDeleted: boolean;
            _id?: {
                $ne: Types.ObjectId;
            };
        } = {
            slug,
            isDeleted: false,
        };

        if (excludeId) {
            filter._id = {
                $ne: new Types.ObjectId(
                    excludeId
                ),
            };
        }

        return Blog.exists(filter);
    }

    async getBlogs(
        filter: Record<
            string,
            unknown
        >,
        page: number,
        limit: number,
        sort: Record<
            string,
            SortOrder
        >
    ) {
        return Blog.find(filter)
            .populate(
                "category",
                "name slug"
            )
            .populate(
                "author",
                "name"
            )
            .populate(
                "featuredImage"
            )
            .sort(sort)
            .skip(
                (page - 1) * limit
            )
            .limit(limit);
    }

    async countBlogs(
        filter: Record<
            string,
            unknown
        >
    ) {
        return Blog.countDocuments(
            filter
        );
    }

    async update(
        id: string,
        data: Partial<IBlog>
    ) {
        return Blog.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async delete(
        id: string
    ) {
        return Blog.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                deletedAt: new Date(),
            },
            {
                new: true,
            }
        );
    }

    async restore(
        id: string
    ) {
        return Blog.findByIdAndUpdate(
            id,
            {
                isDeleted: false,
                deletedAt: null,
            },
            {
                new: true,
            }
        );
    }

    async changeStatus(
        id: string,
        status: string
    ) {
        return Blog.findByIdAndUpdate(
            id,
            {
                status,
            },
            {
                new: true,
            }
        );
    }

    async toggleFeatured(
        id: string,
        featured: boolean
    ) {
        return Blog.findByIdAndUpdate(
            id,
            {
                featured,
            },
            {
                new: true,
            }
        );
    }

    async incrementViews(
        id: string
    ) {
        return Blog.findByIdAndUpdate(
            id,
            {
                $inc: {
                    views: 1,
                },
            }
        );
    }
}

export default new BlogRepository();