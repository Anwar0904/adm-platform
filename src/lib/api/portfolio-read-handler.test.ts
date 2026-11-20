import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/api-error";
import { PERMISSIONS } from "@/constants/permissions";
import { withPortfolioReadAuthorization } from "./portfolio-read-handler";

const request = new NextRequest("http://localhost/api/portfolio");

test("portfolio read guard rejects anonymous and insufficient-permission requests without caching", async () => {
  for (const [status, message] of [[401, "Authorization is required."], [403, "Permission denied."]] as const) {
    let handlerRan = false;
    let checkedPermission = "";
    const response = await withPortfolioReadAuthorization(
      request,
      async () => { handlerRan = true; return NextResponse.json({ data: "private" }); },
      async (_request, permission) => { checkedPermission = permission; throw new ApiError(status, message); },
    );

    assert.equal(handlerRan, false);
    assert.equal(checkedPermission, PERMISSIONS.PORTFOLIO_READ);
    assert.equal(response.status, status);
    assert.equal(response.headers.get("cache-control"), "private, no-store, max-age=0");
    assert.deepEqual(await response.json(), { success: false, message, errors: null });
  }
});

test("portfolio read guard allows an authorized read and keeps the response private", async () => {
  let handlerRan = false;
  const response = await withPortfolioReadAuthorization(
    request,
    async () => { handlerRan = true; return NextResponse.json({ success: true, data: [] }); },
    async (_request, permission) => { assert.equal(permission, PERMISSIONS.PORTFOLIO_READ); return { id: "editor" }; },
  );
  assert.equal(handlerRan, true);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "private, no-store, max-age=0");
});
