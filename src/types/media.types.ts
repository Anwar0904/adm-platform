import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import {
  ContentStatus,
  MediaType,
} from "@/enums";

export interface IMedia {
  fileName: string;

  publicId: string;

  url: string;

  mimeType: string;

  mediaType: MediaType;

  size: number;

  width?: number | null;

  height?: number | null;

  alt?: string;

  caption?: string;

  folder?: string;

  uploadedBy: Types.ObjectId;

  status: ContentStatus;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;
}

export interface MediaMethods {}

export interface MediaStatics {
  findImages(): Promise<MediaDocument[]>;

  findVideos(): Promise<MediaDocument[]>;

  findDocuments(): Promise<MediaDocument[]>;
}

export type MediaDocument =
  HydratedDocument<IMedia, MediaMethods>;

export type MediaModel =
  Model<IMedia, {}, MediaMethods> &
  MediaStatics;