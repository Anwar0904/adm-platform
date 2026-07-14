import { Schema } from "mongoose";
import { IImage } from "@/types/image.types";

export const ImageSchema = new Schema<IImage>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },

    alt: {
      type: String,
      default: "",
      trim: true,
    },

    width: Number,

    height: Number,

    mimeType: String,

    size: Number,
  },
  {
    _id: false,
    versionKey: false,
  }
);