import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { env } from "@/config/env";
import { SESSION_IDLE_TIMEOUT_SECONDS } from "@/constants/auth";

import { JwtPayload } from "@/types/auth";

export class JwtService {
  private static getSecret(type: "access" | "refresh") {
    const secret = type === "access"
      ? env.JWT_ACCESS_SECRET
      : env.JWT_REFRESH_SECRET;

    if (!secret) {
      throw new Error(`JWT ${type} secret is not configured.`);
    }

    return secret as Secret;
  }

  static signAccessToken(
    payload: JwtPayload,
    now = new Date()
  ) {
    return jwt.sign(
      {
        ...payload,
        iat: Math.floor(now.getTime() / 1000),
      },
      this.getSecret("access"),
      {
        expiresIn: env.JWT_ACCESS_EXPIRES,
      } as SignOptions
    );
  }

  static signRefreshToken(
    payload: JwtPayload,
    now = new Date()
  ) {
    return jwt.sign(
      {
        ...payload,
        iat: Math.floor(now.getTime() / 1000),
      },
      this.getSecret("refresh"),
      {
        expiresIn: SESSION_IDLE_TIMEOUT_SECONDS,
      } as SignOptions
    );
  }

  static verifyAccessToken(
    token: string
  ) {
    return jwt.verify(
      token,
      this.getSecret("access")
    ) as JwtPayload;
  }

  static verifyRefreshToken(
    token: string
  ) {
    return jwt.verify(
      token,
      this.getSecret("refresh")
    ) as JwtPayload;
  }

  static decodeRefreshToken(
    token: string
  ): JwtPayload | null {
    const payload = jwt.decode(token);

    return typeof payload === "object" && payload !== null
      ? payload as JwtPayload
      : null;
  }

  static getTokenExpiryDate(token: string): Date {
    const payload = jwt.decode(token);

    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.exp !== "number"
    ) {
      throw new Error("The generated JWT has no expiration claim.");
    }

    return new Date(payload.exp * 1000);
  }
}