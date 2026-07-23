import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";

import AuthService from "@/services/auth/auth.service";

import { LoginSchema } from "@/validators/auth/login.validator";

export async function POST(request: NextRequest) {
  try {
    // Connect Database
    await connectDB();

    // Get Request Body
    const body = await request.json();

    // Validate Request
    const data = LoginSchema.parse(body);

    // Login User
    const result = await AuthService.login(data);
    console.log("===== ROUTE RESULT =====");
    console.log(result);
    // Return Success Response
    return ApiResponse.success(
      result,
      "Login successful."
    );
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
}