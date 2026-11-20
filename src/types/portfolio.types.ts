import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { ContentStatus } from "@/enums";
import { ISeo } from "./seo.types";

export interface IPortfolio {
  title: string;

  slug: string;

  clientName: string;

  shortDescription: string;

  category: Types.ObjectId;


  content: string;

  featuredImage?: Types.ObjectId | null;

  gallery: Types.ObjectId[];

  services: Types.ObjectId[];

  industries: Types.ObjectId[];

  technologies: string[];

  projectUrl?: string;

  githubUrl?: string;

  completionDate?: Date | null;

  seo: ISeo;

  featured: boolean;

  status: ContentStatus;

  publicProof?: {
    approvalStatus: "pending" | "approved" | "revoked";
    approvedAt?: Date | null;
    approvedByRole?: string;
    referenceId?: string;
    permittedElements: Array<
      | "title"
      | "shortDescription"
      | "classification"
      | "category"
      | "visual"
      | "technologies"
      | "industries"
      | "clientName"
      | "projectUrl"
      | "capabilities"
    >;
    consentExpiresAt?: Date | null;
    revokedAt?: Date | null;
    revokedByRole?: string;
    classification?: "client-project" | "adm-product" | "anonymized-engagement" | "concept-prototype";
    capabilities?: Array<"Technology" | "Marketing" | "AI" | "Data">;
  };

  sortOrder: number;

  author: Types.ObjectId;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;
}

export type PortfolioMethods = Record<never, never>;

export interface PortfolioStatics {
  findBySlug(slug: string): Promise<PortfolioDocument | null>;

  findPublished(): Promise<PortfolioDocument[]>;

  findFeatured(): Promise<PortfolioDocument[]>;
}

export type PortfolioDocument =
  HydratedDocument<IPortfolio, PortfolioMethods>;

export type PortfolioModel =
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Mongoose uses an empty query-helper type here.
  Model<IPortfolio, {}, PortfolioMethods> &
  PortfolioStatics;
