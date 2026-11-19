
import {
  HydratedDocument,
  Model,
  Types,
} from "mongoose";

import { LeadSource, LeadStatus } from "@/enums";
import { IBudget } from "./budget.types";
import { INote } from "./note.types";

export interface ILead {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  interestedServices: Types.ObjectId[];
  budget?: IBudget | null;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo?: Types.ObjectId | null;
  notes: INote[];
  projectTitle?: string;

  projectType?: string;

  timeline?: string;

  preferredContact?: "email" | "phone" | "video-call";

  attachments?: string[];

  contactedAt?: Date | null;
  convertedAt?: Date | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadMethods = Record<never, never>;

export interface LeadStatics {
  findByEmail(
    email: string
  ): Promise<LeadDocument | null>;

  findOpenLeads(): Promise<LeadDocument[]>;

  findAssignedTo(
    userId: Types.ObjectId
  ): Promise<LeadDocument[]>;
}

export type LeadDocument =
  HydratedDocument<ILead, LeadMethods>;

export type LeadModel =
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Mongoose uses an empty query-helper type here.
  Model<ILead, {}, LeadMethods> &
  LeadStatics;
