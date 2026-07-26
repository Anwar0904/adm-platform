import { Schema } from "mongoose";

import { IFeature } from "@/types/feature.types";

import { ImageSchema } from "./image.schema";

export const FeatureSchema =
  new Schema<IFeature>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      icon: {
        type: ImageSchema,
        default: null,
      },
    },
    {
      _id: false,
      versionKey: false,
    }
  );