import bcrypt from "bcrypt";

import {
  Schema,
  model,
  models,
} from "mongoose";

import {
  IUser,
  UserModel,
} from "@/types/user.types";

import { USER_STATUS } from "@/enums";

import { ImageSchema } from "@/schemas/image.schema";

const UserSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    avatar: {
      type: ImageSchema,
      default: null,
    },

    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,

    versionKey: false,

    collection: "users",

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);

UserSchema.index(
  {
    email: 1,
  },
  {
    unique: true,
  }
);

UserSchema.index({
  role: 1,
});

UserSchema.index({
  status: 1,
});