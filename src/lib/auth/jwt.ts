import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { env } from "@/config/env";

import { JwtPayload } from "@/types/auth";

export class JwtService {
  static signAccessToken(
    payload: JwtPayload
  ) {
    return jwt.sign(
      payload,
      env.JWT_ACCESS_SECRET as Secret,
      {
        expiresIn: env.JWT_ACCESS_EXPIRES,
      } as SignOptions
    );
  }

  static signRefreshToken(
    payload: JwtPayload
  ) {
    return jwt.sign(
      payload,
      env.JWT_REFRESH_SECRET as Secret,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES,
      } as SignOptions
    );
  }

  static verifyAccessToken(
    token: string
  ) {
    return jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    ) as JwtPayload;
  }

  static verifyRefreshToken(
    token: string
  ) {
    return jwt.verify(
      token,
      env.JWT_REFRESH_SECRET
    ) as JwtPayload;
  }
}