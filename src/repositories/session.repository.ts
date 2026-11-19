import { Types } from "mongoose";

import { Session } from "@/models";
import { BaseRepository } from "./base.repository";


import { ISession } from "@/types/session.types";

class SessionRepository extends BaseRepository<ISession, typeof Session> {
  constructor() {
    super(Session);
  }

  async createSession(
    id: Types.ObjectId,
    data: Partial<ISession>
  ) {
    return this.model.create({
      _id: id,
      ...data,
    });
  }

  async findActiveSessionById(
    id: string | Types.ObjectId,
    userId: string,
    now = new Date()
  ) {
    return this.model.findOne({
      _id: id,
      user: userId,
      isRevoked: false,
      expiresAt: { $gt: now },
    });
  }

  async recordSessionActivity(
    id: Types.ObjectId,
    userId: string,
    activityAt: Date,
    expiresAt: Date,
    now = new Date()
  ) {
    return this.model.findOneAndUpdate(
      {
        _id: id,
        user: userId,
        isRevoked: false,
        expiresAt: { $gt: now },
      },
      {
        $max: {
          lastActivityAt: activityAt,
          expiresAt,
        },
      },
      {
        new: true,
      }
    );
  }

  async rotateRefreshToken(
    id: Types.ObjectId,
    currentHash: string,
    nextHash: string,
    lastUsedAt: Date,
    expiresAt: Date,
    lastActivityAt: Date
  ) {
    return this.model.findOneAndUpdate(
      {
        _id: id,
        refreshToken: currentHash,
        isRevoked: false,
        expiresAt: { $gt: lastUsedAt },
      },
      {
        $set: {
          refreshToken: nextHash,
          lastUsedAt,
        },
        $max: {
          lastActivityAt,
          expiresAt,
        },
      },
      {
        new: true,
      }
    );
  }

  async revokeActiveSession(
    id: Types.ObjectId,
    currentHash: string
  ) {
    return this.model.findOneAndUpdate(
      {
        _id: id,
        refreshToken: currentHash,
        isRevoked: false,
      },
      {
        isRevoked: true,
      },
      {
        new: true,
      }
    );
  }

  async revokeActiveSessionById(
    id: string | Types.ObjectId,
    userId: string
  ) {
    return this.model.findOneAndUpdate(
      {
        _id: id,
        user: userId,
        isRevoked: false,
      },
      {
        isRevoked: true,
      },
      {
        new: true,
      }
    );
  }

  async revokeSession(refreshToken: string) {
    return this.model.findOneAndUpdate(
      {
        refreshToken,
        isRevoked: false,
      },
      {
        isRevoked: true,
      },
      {
        new: true,
      }
    );
  }

  async revokeAllUserSessions(userId: string) {
    return this.model.updateMany(
      {
        user: userId,
        isRevoked: false,
      },
      {
        isRevoked: true,
      }
    );
  }

  async findValidSession(refreshToken: string) {
    return this.model.findOne({
      refreshToken,
      isRevoked: false,
      expiresAt: {
        $gt: new Date(),
      },
    });
  }
  async find(filter = {}) {
    return this.model.find(filter);
  }
  async updateMany(filter: object, update: object) {
    return this.model.updateMany(
      filter,
      update
    );
  }
}

export default new SessionRepository();
