import { createAuthClient } from "@neondatabase/auth";
import { SupabaseAuthAdapter } from "@neondatabase/auth/vanilla/adapters";

function readPublicNeonEnv() {
  const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL?.trim();

  if (!authUrl) {
    return null;
  }

  return { authUrl };
}

export function hasNeonBrowserEnv() {
  return readPublicNeonEnv() !== null;
}

export function createBrowser() {
  const env = readPublicNeonEnv();

  if (!env) {
    throw new Error("Missing NEXT_PUBLIC_NEON_AUTH_URL.");
  }

  return createAuthClient(env.authUrl, {
    adapter: SupabaseAuthAdapter(),
  });
}
