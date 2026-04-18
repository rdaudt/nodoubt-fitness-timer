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
  await auth.getSession();

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}
