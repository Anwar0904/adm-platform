import { Schema } from "mongoose";
import { ISeo } from "@/types/seo.types";
import { ImageSchema } from "./image.schema";

export const SeoSchema = new Schema<ISeo>(
  {
    metaTitle: {
      type: String,
      required: true,
      trim: true,
    },

    metaDescription: {
      type: String,
      required: true,
      trim: true,
    },

    keywords: [
      {
        type: String,
        trim: true,
      },
    ],

    canonicalUrl: String,

    ogTitle: String,

    ogDescription: String,

    ogImage: ImageSchema,

    robots: {
      type: String,
      default: "index,follow",
    },

    schemaMarkup: {
      type: Schema.Types.Mixed,
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);