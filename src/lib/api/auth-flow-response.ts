import { NextResponse } from "next/server";

const PRIVATE_HEADERS = { "Cache-Control": "no-store, private", Pragma: "no-cache" };

export function authFlowUnavailableResponse() {
  return NextResponse.json(
    { success: false, message: "This request cannot be processed right now." },
    { status: 503, headers: PRIVATE_HEADERS },
  );
}

export function authFlowAcceptedResponse() {
  return NextResponse.json(
    {
      success: true,
      message: "If the request is eligible, next steps will be sent.",
      data: { accepted: true },
    },
    { status: 202, headers: PRIVATE_HEADERS },
  );
}

export function authFlowNotFoundResponse() {
  return NextResponse.json(
    { success: false, message: "Not found." },
    { status: 404, headers: PRIVATE_HEADERS },
  );
}

export function authFlowRateLimitedResponse() {
  return NextResponse.json(
    { success: false, message: "Too many requests. Try again later." },
    { status: 429, headers: PRIVATE_HEADERS },
  );
}
