import {
    SortOrder,
    Types,
} from "mongoose";

import { Lead } from "@/models/lead.model";

import LeadRepository from "@/repositories/lead.repository";

import { ApiError } from "@/lib/api/api-error";

import {
    LEAD_SOURCE,
    LEAD_STATUS,
    LeadStatus,
} from "@/enums";

import {
    CreateLeadInput,
    UpdateLeadInput,
    LeadQuery,
} from "@/types/lead-management";

class LeadService {
    async getLeads(
        query: LeadQuery
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
            filter.$or = [
                {
                    fullName: {
                        $regex:
                            query.search,
                        $options:
                            "i",
                    },
                },
                {
                    email: {
                        $regex:
                            query.search,
                        $options:
                            "i",
                    },
                },
                {
                    company: {
                        $regex:
                            query.search,
                        $options:
                            "i",
                    },
                },
            ];
        }

        if (query.status) {
            filter.status =
                query.status;
        }

        if (query.source) {
            filter.source =
                query.source;
        }

        if (
            query.assignedTo
        ) {
            filter.assignedTo =
                new Types.ObjectId(
                    query.assignedTo
                );
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

            sort = {
                [field]:
                    query.sort.startsWith(
                        "-"
                    )
                        ? -1
                        : 1,
            };
        }

        const [
            leads,
            total,
        ] = await Promise.all([
            LeadRepository.getLeads(
                filter,
                page,
                limit,
                sort
            ),
            LeadRepository.countLeads(
                filter
            ),
        ]);

        return {
            leads,

            pagination: {
                page,
                limit,
                total,
                totalPages:
                    Math.ceil(
                        total /
                        limit
                    ),
            },
        };
    }

    async getLeadById(
        id: string
    ) {
        const lead =
            await LeadRepository.findById(
                id
            );

        if (
            !lead ||
            lead.isDeleted
        ) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        return lead;
    }

    async createLead(
        data: CreateLeadInput,
        userId?: string
    ) {
        const existing =
            await LeadRepository.findByEmail(
                data.email
            );

        if (
            existing &&
            !existing.isDeleted
        ) {
            throw new ApiError(
                409,
                "Lead already exists."
            );
        }

        return LeadRepository.create({
            fullName: data.fullName,

            email: data.email,

            phone: data.phone,

            company: data.company,

            website: data.website,

            message: data.message,

            budget: data.budget ?? null,

            notes:
                data.notes?.map(
                    (note) => ({
                        note: note.note,

                        createdAt:
                            note.createdAt ??
                            new Date(),

                        createdBy:
                            note.createdBy
                                ? new Types.ObjectId(
                                    note.createdBy
                                )
                                : null,
                    })
                ) ?? [],

            interestedServices:
                data.interestedServices.map(
                    (id) =>
                        new Types.ObjectId(id)
                ),

            assignedTo:
                data.assignedTo
                    ? new Types.ObjectId(
                        data.assignedTo
                    )
                    : null,

            source:
                data.source ??
                LEAD_SOURCE.WEBSITE,

            status:
                data.status ??
                LEAD_STATUS.NEW,

            createdBy: userId
                ? new Types.ObjectId(userId)
                : null,

            updatedBy: userId
                ? new Types.ObjectId(userId)
                : null,

            isDeleted: false,

            deletedAt: null,
        });
    }

    async updateLead(
        id: string,
        data: UpdateLeadInput,
        userId: string
    ) {
        const lead =
            await Lead.findById(
                id
            );

        if (
            !lead ||
            lead.isDeleted
        ) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        Object.assign(
            lead,
            data
        );

        if (
            data.interestedServices
        ) {
            lead.interestedServices =
                data.interestedServices.map(
                    (id) =>
                        new Types.ObjectId(
                            id
                        )
                );
        }

        if (
            data.assignedTo !==
            undefined
        ) {
            lead.assignedTo =
                data.assignedTo
                    ? new Types.ObjectId(
                        data.assignedTo
                    )
                    : null;
        }

        lead.updatedBy =
            new Types.ObjectId(
                userId
            );

        await lead.save();

        return lead;
    }

    async deleteLead(
        id: string
    ) {
        const lead =
            await Lead.findById(
                id
            );

        if (!lead) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        if (
            lead.isDeleted
        ) {
            throw new ApiError(
                400,
                "Lead already deleted."
            );
        }

        lead.isDeleted = true;

        lead.deletedAt =
            new Date();

        await lead.save();

        return true;
    }

    async restoreLead(
        id: string
    ) {
        const lead =
            await Lead.findById(id);

        if (!lead) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        lead.isDeleted = false;

        lead.deletedAt = null;

        await lead.save();

        return lead;
    }

    async changeStatus(
        id: string,
        status: LeadStatus
    ) {
        const lead =
            await Lead.findById(id);

        if (
            !lead ||
            lead.isDeleted
        ) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        lead.status = status;

        if (
            status ===
            LEAD_STATUS.CONVERTED
        ) {
            lead.convertedAt =
                new Date();
        }

        await lead.save();

        return lead;
    }

    async assignLead(
        id: string,
        assignedTo: string
    ) {
        const lead =
            await Lead.findById(id);

        if (
            !lead ||
            lead.isDeleted
        ) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        lead.assignedTo =
            new Types.ObjectId(
                assignedTo
            );

        await lead.save();

        return lead;
    }

    async markContacted(
        id: string
    ) {
        const lead =
            await Lead.findById(id);

        if (
            !lead ||
            lead.isDeleted
        ) {
            throw new ApiError(
                404,
                "Lead not found."
            );
        }

        lead.contactedAt =
            new Date();

        if (
            lead.status ===
            LEAD_STATUS.NEW
        ) {
            lead.status =
                LEAD_STATUS.CONTACTED;
        }

        await lead.save();

        return lead;
    }
}

export default new LeadService();