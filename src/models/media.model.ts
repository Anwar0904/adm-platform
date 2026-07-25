import {
  Schema,
  model,
  models,
} from "mongoose";

import {
  IMedia,
  MediaModel,
} from "@/types/media.types";

import {
  CONTENT_STATUS,
  MEDIA_TYPE,
} from "@/enums";

const MediaSchema =
  new Schema<IMedia, MediaModel>(
    {
      fileName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255,
      },

      publicId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      url: {
        type: String,
        required: true,
        trim: true,
      },

      mimeType: {
        type: String,
        required: true,
        trim: true,
      },

      mediaType: {
        type: String,
        enum: Object.values(MEDIA_TYPE),
        required: true,
      },

      size: {
        type: Number,
        required: true,
        min: 0,
      },

      width: {
        type: Number,
        default: null,
      },

      height: {
        type: Number,
        default: null,
      },

      alt: {
        type: String,
        default: "",
        trim: true,
      },

      caption: {
        type: String,
        default: "",
        trim: true,
      },

      folder: {
        type: String,
        default: "",
        trim: true,
      },

      uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      status: {
        type: String,
        enum: Object.values(CONTENT_STATUS),
        default: CONTENT_STATUS.PUBLISHED,
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
      collection: "media",
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );


MediaSchema.index({ url: 1 });
MediaSchema.index({ mediaType: 1 });

MediaSchema.index({ uploadedBy: 1 });

MediaSchema.index({ status: 1 });

MediaSchema.index({
  fileName: "text",
  alt: "text",
  caption: "text",
});

MediaSchema.static("findImages", function () {
  return this.find({
    mediaType: MEDIA_TYPE.IMAGE,
    isDeleted: false,
  });
});

MediaSchema.static("findVideos", function () {
  return this.find({
    mediaType: MEDIA_TYPE.VIDEO,
    isDeleted: false,
  });
});

MediaSchema.static("findDocuments", function () {
  return this.find({
    mediaType: {
      $in: [
        MEDIA_TYPE.DOCUMENT,
        MEDIA_TYPE.PDF,
      ],
    },
    isDeleted: false,
  });
});


export const Media =
  (models.Media as MediaModel) ||
  model<IMedia, MediaModel>(
    "Media",
    MediaSchema
  );