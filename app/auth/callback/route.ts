import { NextResponse, type NextRequest } from "next/server";

import {
  AUTH_TEST_COOKIE_NAME,
  encodeMockAuthSession,
  isAuthTestMode,
} from "../../../lib/neon/server";

function normalizeNextPath(rawNextPath: string | null) {
  if (!rawNextPath) {
    return "/";
  }

  if (!rawNextPath.startsWith("/") || rawNextPath.startsWith("//")) {
    return "/";
  }

  return rawNextPath;
}

function buildMockSession(requestUrl: URL) {
  const userId = requestUrl.searchParams.get("mock_user_id")?.trim();

  if (!userId) {
    return null;
  }

  const fullName = requestUrl.searchParams.get("mock_name")?.trim() ?? null;
  const firstName = fullName ? fullName.split(/\s+/)[0] ?? fullName : null;

  return {
    userId,
    email: requestUrl.searchParams.get("mock_email")?.trim() ?? null,
    firstName,
    avatarUrl: requestUrl.searchParams.get("mock_avatar_url")?.trim() ?? null,
  };
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const redirectPath = normalizeNextPath(requestUrl.searchParams.get("next"));
  const redirectUrl = new URL(redirectPath, requestUrl.origin);

  if (isAuthTestMode()) {
    const mockSession = buildMockSession(requestUrl);

    if (mockSession) {
      const response = NextResponse.redirect(redirectUrl);

      response.cookies.set(
        AUTH_TEST_COOKIE_NAME,
        encodeMockAuthSession(mockSession),
        {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        },
      );

      return response;
    }
  }

  // Production auth callbacks are handled by Neon Auth route handlers under
  // /api/auth/[...path]. This endpoint remains for AUTH_TEST_MODE mocking.
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set("ndft-auth-error", "deprecated-callback", {
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60,
  });
  return response;
}
