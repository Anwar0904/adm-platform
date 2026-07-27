import {
    SortOrder,
    Types,
} from "mongoose";

import { TeamMember } from "@/models/team-member.model";

import TeamMemberRepository from "@/repositories/team-member.repository";

import { ApiError } from "@/lib/api/api-error";

import {
    CONTENT_STATUS,
    ContentStatus,
} from "@/enums";

import {
    CreateTeamMemberInput,
    UpdateTeamMemberInput,
    TeamMemberQuery,
} from "@/types/team-member-management";

class TeamMemberService {
    async getTeamMembers(
        query: TeamMemberQuery
    ) {
        const page = Number(
            query.page ?? 1
        );

        const limit = Number(
            query.limit ?? 10
        );

        const filter: Record<
            string,
            unknown
        > = {
            isDeleted: false,
        };

        if (query.search) {
            filter.$text = {
                $search: query.search,
            };
        }

        if (query.status) {
            filter.status = query.status;
        }

        if (query.author) {
            filter.author =
                new Types.ObjectId(
                    query.author
                );
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
                query.sort.replace("-", "");

            sort = {
                [field]:
                    query.sort.startsWith("-")
                        ? -1
                        : 1,
            };
        }

        const [
            teamMembers,
            total,
        ] = await Promise.all([
            TeamMemberRepository.getTeamMembers(
                filter,
                page,
                limit,
                sort
            ),

            TeamMemberRepository.countTeamMembers(
                filter
            ),
        ]);

        return {
            teamMembers,

            pagination: {
                page,

                limit,

                total,

                totalPages:
                    Math.ceil(total / limit),
            },
        };
    }

    async getTeamMemberById(
        id: string
    ) {
        const teamMember =
            await TeamMemberRepository.findById(
                id
            );

        if (
            !teamMember ||
            teamMember.isDeleted
        ) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        return teamMember;
    }

    async createTeamMember(
        data: CreateTeamMemberInput,
        userId: string
    ) {
        if ("slug" in data && data.slug) {
            const exists =
                await TeamMemberRepository.slugExists(
                    data.slug
                );

            if (exists) {
                throw new ApiError(
                    409,
                    "Slug already exists."
                );
            }
        }

        return TeamMemberRepository.create({
            ...data,

            author:
                new Types.ObjectId(
                    userId
                ),

            avatar: data.avatar
                ? new Types.ObjectId(
                    data.avatar
                )
                : null,

            gallery:
                data.gallery?.map(
                    (id) =>
                        new Types.ObjectId(id)
                ) ?? [],

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
                data.featured ?? false,

            sortOrder:
                data.sortOrder ?? 0,

            isDeleted: false,

            deletedAt: null,
        });
    }

    async updateTeamMember(
        id: string,
        data: UpdateTeamMemberInput,
        userId: string
    ) {
        const teamMember =
            await TeamMember.findById(id);

        if (
            !teamMember ||
            teamMember.isDeleted
        ) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        if (
            "slug" in data &&
            data.slug &&
            data.slug !== teamMember.slug
        ) {
            const exists =
                await TeamMemberRepository.slugExists(
                    data.slug,
                    id
                );

            if (exists) {
                throw new ApiError(
                    409,
                    "Slug already exists."
                );
            }
        }

        Object.assign(
            teamMember,
            data
        );

        if (
            data.avatar !== undefined
        ) {
            teamMember.avatar =
                data.avatar
                    ? new Types.ObjectId(
                        data.avatar
                    )
                    : null;
        }

        if (data.gallery) {
            teamMember.gallery =
                data.gallery.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                );
        }

        teamMember.updatedBy =
            new Types.ObjectId(
                userId
            );

        await teamMember.save();

        return teamMember;
    }

    async deleteTeamMember(
        id: string
    ) {
        const teamMember =
            await TeamMember.findById(id);

        if (!teamMember) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        if (
            teamMember.isDeleted
        ) {
            throw new ApiError(
                400,
                "Team member already deleted."
            );
        }

        teamMember.isDeleted = true;

        teamMember.deletedAt =
            new Date();

        await teamMember.save();

        return true;
    }

    async restoreTeamMember(
        id: string
    ) {
        const teamMember =
            await TeamMember.findById(id);

        if (!teamMember) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        teamMember.isDeleted = false;

        teamMember.deletedAt = null;

        await teamMember.save();

        return teamMember;
    }

    async changeStatus(
        id: string,
        status: ContentStatus
    ) {
        const teamMember =
            await TeamMember.findById(id);

        if (!teamMember) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        teamMember.status = status;

        await teamMember.save();

        return teamMember;
    }

    async toggleFeatured(
        id: string,
        featured: boolean
    ) {
        const teamMember =
            await TeamMember.findById(id);

        if (!teamMember) {
            throw new ApiError(
                404,
                "Team member not found."
            );
        }

        teamMember.featured =
            featured;

        await teamMember.save();

        return teamMember;
    }
}




export default new TeamMemberService();