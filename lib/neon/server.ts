import { NeonPostgrestClient, fetchWithToken } from "@neondatabase/postgrest-js";
import { cookies } from "next/headers";

import { getNeonAuthServer, hasNeonAuthServerEnv } from "./auth-server";

export const AUTH_TEST_COOKIE_NAME = "ndft-auth-test-session";

export interface MockAuthSession {
  userId: string;
  email: string | null;
  firstName: string | null;
  avatarUrl: string | null;
}

export interface NeonDataEnv {
  dataApiUrl: string;
  authUrl: string;
}

function normalizeOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function getNeonEnv(): NeonDataEnv | null {
  const dataApiUrl = process.env.NEXT_PUBLIC_NEON_DATA_API_URL?.trim();
  const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL?.trim();

  if (!dataApiUrl || !authUrl) {
    return null;
  }

  return { dataApiUrl, authUrl };
}

export function isAuthTestMode() {
  return process.env.AUTH_TEST_MODE === "1";
}

export function encodeMockAuthSession(session: MockAuthSession) {
  return encodeURIComponent(JSON.stringify(session));
}

export async function getMockAuthSession() {
  if (!isAuthTestMode()) {
    return null;
  }

  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(AUTH_TEST_COOKIE_NAME)?.value;

  if (!rawCookie) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      decodeURIComponent(rawCookie),
    ) as Partial<MockAuthSession>;

    const userId = normalizeOptionalString(parsed.userId);

    if (!userId) {
      return null;
    }

    return {
      userId,
      email: normalizeOptionalString(parsed.email),
      firstName: normalizeOptionalString(parsed.firstName),
      avatarUrl: normalizeOptionalString(parsed.avatarUrl),
    } satisfies MockAuthSession;
  } catch {
    return null;
  }
}

async function resolveAuthToken() {
  if (!hasNeonAuthServerEnv()) {
    return null;
  }

  const auth = await getNeonAuthServer();

  try {
    const accessResult = await auth.getAccessToken();
    const accessToken =
      (accessResult as { data?: { token?: string | null } }).data?.token ??
      null;

    if (accessToken) {
      return accessToken;
    }
  } catch {
    // Fall through to anonymous-token attempt.
  }

  const anonymousResult = await auth.getAnonymousToken?.();

  return anonymousResult?.data?.token ?? null;
}

export async function createServer() {
  const env = getNeonEnv();

  if (!env) {
    throw new Error(
      "Missing NEXT_PUBLIC_NEON_DATA_API_URL or NEXT_PUBLIC_NEON_AUTH_URL.",
    );
  }

  return new NeonPostgrestClient({
    dataApiUrl: env.dataApiUrl,
    options: {
      global: {
        fetch: fetchWithToken(resolveAuthToken),
      },
    },
  });
}
