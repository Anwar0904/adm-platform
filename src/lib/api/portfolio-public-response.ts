import { Error as MongooseError } from "mongoose";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "@/lib/api/api-error";

export function portfolioPublicErrorResponse(error: unknown): NextResponse {
  let status = 503;
  let message = "Portfolio content is temporarily unavailable.";
  let errors: unknown;

  if (error instanceof ApiError) {
    status = error.statusCode;
    message = error.message;
    errors = error.errors;
  } else if (error instanceof ZodError) {
    status = 400;
    message = "Invalid portfolio request.";
    errors = error.flatten();
  } else if (error instanceof MongooseError.ValidationError) {
    status = 400;
    message = "Invalid portfolio request.";
    errors = error.errors;
  } else if (error instanceof MongooseError.CastError) {
    status = 400;
    message = "Invalid portfolio request.";
  }

  return NextResponse.json(
    { success: false, message, ...(errors ? { errors } : {}) },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
