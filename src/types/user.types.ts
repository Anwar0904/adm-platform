import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { UserStatus } from "@/enums";
import { IImage } from "./image.types";
import { RoleDocument } from "./role.types";

export interface IUser {
  name: string;

  email: string;

  password: string;

  avatar?: IImage | null;

  role: Types.ObjectId | RoleDocument;

  status: UserStatus;

  passwordResetToken?: string | null;

  passwordResetExpires?: Date | null;

  emailVerified: boolean;

  emailVerificationToken?: string | null;

  emailVerificationExpires?: Date | null;

  lastLogin?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;
}

export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserStatics {
  findByEmail(email: string): Promise<UserDocument | null>;
}

export type UserDocument =
  HydratedDocument<IUser, UserMethods>;

export type UserModel =
  Model<IUser, {}, UserMethods> &
  UserStatics;



export interface UpdateUserInput {
  name?: string;
  avatar?: IImage | null;
}