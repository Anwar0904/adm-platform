import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { UserStatus } from "@/enums";
import { IImage } from "./image.types";
import { RoleDocument } from "./role.types";

export interface IUser {
  /** Legacy authentication field retained for existing accounts. */
  name?: string;

  firstName?: string;

  lastName?: string;

  email: string;

  password: string;

  avatar?: IImage | string | null;

  role: Types.ObjectId | RoleDocument;

  status: UserStatus;

  passwordResetToken?: string | null;

  passwordResetExpires?: Date | null;

  /** Legacy verification field retained for existing accounts. */
  emailVerified?: boolean;

  isEmailVerified?: boolean;

  emailVerificationToken?: string | null;

  emailVerificationExpires?: Date | null;

  lastLogin?: Date | null;

  passwordChangedAt?: Date | null;

  phone?: string | null;

  jobTitle?: string | null;

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
  Model<IUser, object, UserMethods> &
  UserStatics;



export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  status?: UserStatus;
  phone?: string | null;
  jobTitle?: string | null;
  avatar?: IImage | string | null;
  isEmailVerified?: boolean;
}