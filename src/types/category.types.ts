import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { ContentStatus } from "@/enums";
import { IImage } from "./image.types";
import { ISeo } from "./seo.types";

export interface ICategory {
  name: string;

  slug: string;

  description?: string;

  image?: IImage | null;

  parent?: Types.ObjectId | null;

  seo?: ISeo | null;

  status: ContentStatus;

  sortOrder: number;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;
}

export type CategoryMethods = Record<never, never>;

export interface CategoryStatics {
  findBySlug(slug: string): Promise<CategoryDocument | null>;

  findPublished(): Promise<CategoryDocument[]>;

  findRootCategories(): Promise<CategoryDocument[]>;
}

export type CategoryDocument =
  HydratedDocument<ICategory, CategoryMethods>;

export type CategoryModel =
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Mongoose uses an empty query-helper type here.
  Model<ICategory, {}, CategoryMethods> &
  CategoryStatics;
