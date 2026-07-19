import { Types } from "mongoose";


import { BaseRepository } from "./base.repository";

import { Session } from "@/models";
import { ISession } from "@/types/session.types";

class SessionRepository extends BaseRepository<ISession> {
  constructor() {
    super(Session);
  }

  async findActiveSession(
    refreshToken: string
  ) {
    return this.findOne({
      refreshToken,
      isRevoked: false,
    });
  }

  async revoke(
    sessionId: Types.ObjectId
  ) {
    return this.updateById(sessionId, {
      isRevoked: true,
    });
  }

  async revokeAll(
    userId: Types.ObjectId
  ) {
    return Session.updateMany(
      {
        user: userId,
      },
      {
        isRevoked: true,
      }
    );
  }

  async findUserSessions(
    userId: Types.ObjectId
  ) {
    return this.findMany({
      user: userId,
      isRevoked: false,
    });
  }
}

export default new SessionRepository();