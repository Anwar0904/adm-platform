import { Types } from "mongoose";
import { IUser } from "@/types/user.types";
import { BaseRepository } from "./base.repository";

import { User } from "@/models/user.model";
import { UserDocument } from "@/types/user.types";

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
}

export default new UserRepository();