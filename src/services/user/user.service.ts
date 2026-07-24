import mongoose from "mongoose";

import { ApiError } from "@/lib/api/api-error";

import UserRepository from "@/repositories/user.repository";

import { PasswordService } from "@/lib/auth/bcrypt";

import {
    CreateUserInput,
    UpdateUserInput,
    UserQuery,
} from "@/types/user-management";
import { User } from "@/models/user.model";
import { USER_STATUS } from "@/enums";

class UserService {

    async getUsers(query: UserQuery) {

        const page = Number(query.page ?? 1);

        const limit = Number(query.limit ?? 10);

        const filter: Record<string, unknown> = {
            isDeleted: false,
        };

        if (query.search) {
            filter.$or = [
                {
                    name: {
                        $regex: query.search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: query.search,
                        $options: "i",
                    },
                },
            ];
        }

        if (query.status) {
            filter.status = query.status;
        }

        if (query.role) {
            filter.role =
                new mongoose.Types.ObjectId(
                    query.role
                );
        }

        let sort: Record<
            string,
            1 | -1
        > = {
            createdAt: -1,
        };

        if (query.sort) {
            const field =
                query.sort.replace("-", "");

            const direction =
                query.sort.startsWith("-")
                    ? -1
                    : 1;

            sort = {
                [field]: direction,
            };
        }

        const [users, total] =
            await Promise.all([
                UserRepository.getUsers(
                    filter,
                    page,
                    limit,
                    sort
                ),
                UserRepository.countUsers(
                    filter
                ),
            ]);

        return {
            users,

            pagination: {
                page,

                limit,

                total,

                totalPages: Math.ceil(
                    total / limit
                ),
            },
        };
    }

    async getUserById(id: string) {
        const user = await User.findById(id)
            .select(
                "-password -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires"
            )
            .populate("role");

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        return user;
    }

    async createUser(data: CreateUserInput) {

        const exists = await UserRepository.emailExists(
            data.email
        );

        if (exists) {
            throw new ApiError(
                409,
                "Email already exists."
            );
        }

        const password =
            await PasswordService.hash(
                data.password
            );

        const user = await User.create({
            name: data.name,
            email: data.email.toLowerCase(),
            password,
            role: data.role,
            status: USER_STATUS.ACTIVE,
            emailVerified: true,
        });

        return this.getUserById(
            user._id.toString()
        );
    }

    async updateUser(
        id: string,
        data: UpdateUserInput
    ) {
        const user = await User.findById(id);

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        if (data.email !== undefined) {
            const exists =
                await User.findOne({
                    email: data.email.toLowerCase(),
                    _id: { $ne: id },
                });

            if (exists) {
                throw new ApiError(
                    409,
                    "Email already exists."
                );
            }

            user.email =
                data.email.toLowerCase();
        }

        if (data.name !== undefined) {
            user.name = data.name;
        }

        if (data.role !== undefined) {
            user.role = new mongoose.Types.ObjectId(
                data.role
            );
        }

        if (data.status !== undefined) {
            user.status = data.status as typeof user.status;
        }

        await user.save();

        const updatedUser = await User.findById(id)
            .select(
                "-password -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires"
            )
            .populate("role");

        if (!updatedUser) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        return updatedUser;
    }


    async deleteUser(id: string) {
        const user = await User.findById(id);

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        if (user.isDeleted) {
            throw new ApiError(
                400,
                "User already deleted."
            );
        }

        user.isDeleted = true;
        user.deletedAt = new Date();
        user.status = USER_STATUS.INACTIVE;

        await user.save();

        return true;
    }

    async restoreUser(id: string) {

        const user = await User.findById(id);

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        if (!user.isDeleted) {
            throw new ApiError(
                400,
                "User is not deleted."
            );
        }

        user.isDeleted = false;
        user.deletedAt = null;
        user.status = USER_STATUS.ACTIVE;

        await user.save();

        return user;
    }

    async changeStatus(
        id: string,
        status: string
    ) {

        const user = await User.findById(id);

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        user.status = status as typeof user.status;

        await user.save();

        return user;
    }
}

export default new UserService();