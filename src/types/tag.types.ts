import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { ContentStatus } from "@/enums";

export interface ITag {
  name: string;

  slug: string;

  description?: string;

  color: string;

  status: ContentStatus;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;
}

export type TagMethods = Record<never, never>;

export interface TagStatics {
  findBySlug(slug: string): Promise<TagDocument | null>;

  findPublished(): Promise<TagDocument[]>;
}

export type TagDocument =
  HydratedDocument<ITag, TagMethods>;

export type TagModel =
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Mongoose uses an empty query-helper type here.
  Model<ITag, {}, TagMethods> &
  TagStatics;
