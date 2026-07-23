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
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
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


UserSchema.index({
  status: 1,
});

UserSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret: any) => {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationExpires;
    delete ret.__v;

    return ret;
  },
});

UserSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret: any) => {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationExpires;
    delete ret.__v;

    return ret;
  },
});

export const User =
  (models.User as UserModel) ||
  model<IUser, UserModel>(
    "User",
    UserSchema
  );