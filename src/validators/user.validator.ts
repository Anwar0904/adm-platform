import { z } from "zod";

import { USER_STATUS } from "@/enums";
import { PasswordSchema } from "./common.validator";

export const CreateUserSchema =
    z.object({
        name: z.string().min(2).max(100),

        email: z.string().email(),

        password: PasswordSchema,

        role: z.string(),

        status: z
            .enum(
                Object.values(
                    USER_STATUS
                ) as [string, ...string[]]
            )
            .optional(),
    });




export const UpdateUserSchema = z.object({
    name: z.string().min(2).max(100).optional(),

    email: z.string().email().optional(),

    role: z.string().optional(),

    status: z
        .enum(
            Object.values(
                USER_STATUS
            ) as [string, ...string[]]
        )
        .optional(),

    avatar: z.any().optional(),
});

export const UserQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().optional(),

    status: z.string().optional(),

    role: z.string().optional(),

    sort: z.string().default("-createdAt"),
});


export const UpdateUserStatusSchema =
    z.object({
        status: z.enum(
            Object.values(
                USER_STATUS
            ) as [string, ...string[]]
        ),
    });

