import { Types } from "mongoose";

import { IUser } from "@/types/user.types";
import { User } from "@/models/user.model";

import { BaseRepository } from "./base.repository";

type UserFilter = Record<string, unknown>;

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string) {
    return this.findOne({
      email: email.toLowerCase(),
    });
  }

  async emailExists(email: string) {
    return this.exists({
      email: email.toLowerCase(),
    });
  }

  async updateLastLogin(
    userId: Types.ObjectId
  ) {
    return this.updateById(userId, {
      lastLogin: new Date(),
    });
  }

  async getById(id: string) {
    return User.findById(id)
      .populate("role");
  }

  async getUsers(
    filter: UserFilter,
    page: number,
    limit: number,
    sort: Record<string, 1 | -1>
  ) {
    return User.find(filter)
      .populate("role")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async countUsers(
    filter: UserFilter
  ) {
    return User.countDocuments(filter);
  }
}

export default new UserRepository();