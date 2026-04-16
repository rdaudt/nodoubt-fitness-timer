import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const AUTH_TEST_COOKIE_NAME = "ndft-auth-test-session";

export interface MockAuthSession {
  userId: string;
  email: string | null;
  firstName: string | null;
  avatarUrl: string | null;
}

function normalizeOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function isAuthTestMode() {
  return process.env.AUTH_TEST_MODE === "1";
}

export function encodeMockAuthSession(session: MockAuthSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
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
      Buffer.from(rawCookie, "base64url").toString("utf8"),
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

export async function createServer() {
  const env = getSupabaseEnv();

  if (!env) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components can read cookies but may not be allowed to write
          // them. Middleware handles refresh writes before rendering.
        }
      },
    },
  });
}
