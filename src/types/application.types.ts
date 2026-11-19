import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import {
  ApplicationStatus,
} from "@/enums";

import { IBudget } from "./budget.types";
import { INote } from "./note.types";

export interface IApplication {
  career: Types.ObjectId;

  fullName: string;

  email: string;

  phone: string;

  address?: string;

  resume: Types.ObjectId;

  coverLetter?: string;

  portfolioUrl?: string;

  linkedinUrl?: string;

  githubUrl?: string;

  experience?: number;

  expectedSalary?: IBudget | null;

  skills: string[];

  status: ApplicationStatus;

  notes: INote[];

  reviewedBy?: Types.ObjectId | null;

  reviewedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type ApplicationMethods = Record<never, never>;

export interface ApplicationStatics {
  findByCareer(
    career: Types.ObjectId
  ): Promise<ApplicationDocument[]>;

  findPending(): Promise<ApplicationDocument[]>;

  findByEmail(
    email: string
  ): Promise<ApplicationDocument[]>;
}

export type ApplicationDocument =
  HydratedDocument<
    IApplication,
    ApplicationMethods
  >;

export type ApplicationModel =
  Model<
    IApplication,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Mongoose uses an empty query-helper type here.
    {},
    ApplicationMethods
  > &
  ApplicationStatics;
