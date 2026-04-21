import { NextResponse, type NextRequest } from "next/server";

import { getNeonAuthServer, hasNeonAuthServerEnv } from "./auth-server";
import { isAuthTestMode } from "./server";

export async function updateSession(request: NextRequest) {
  if (isAuthTestMode() || !hasNeonAuthServerEnv()) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  if (request.nextUrl.pathname.startsWith("/api/auth/")) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  const auth = await getNeonAuthServer();
  const hasSessionVerifier = request.nextUrl.searchParams.has(
    "neon_auth_session_verifier",
  );

  if (hasSessionVerifier) {
    // The verifier query param is returned from OAuth and must be processed
    // through Neon middleware so session cookies are written for this origin.
    return (await auth.middleware()(request)) as NextResponse;
  }

  await auth.getSession();

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}
