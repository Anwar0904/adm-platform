import { HydratedDocument, Model, Types } from "mongoose";

export interface ISession {
  user: Types.ObjectId;

  refreshToken: string;

  userAgent?: string;

  ipAddress?: string;

  expiresAt: Date;

  lastActivityAt?: Date;

  lastUsedAt: Date;

  isRevoked: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface SessionMethods {
  revoke(): Promise<void>;
}

export interface SessionStatics {
  findActiveByUser(
    userId: Types.ObjectId
  ): Promise<SessionDocument[]>;

  revokeAll(
    userId: Types.ObjectId
  ): Promise<void>;
}

export type SessionDocument =
  HydratedDocument<ISession, SessionMethods>;

export type SessionModel =
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Mongoose uses an empty query-helper type here.
  Model<ISession, {}, SessionMethods> &
  SessionStatics;
