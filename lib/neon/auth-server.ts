export interface NeonAuthServerEnv {
  baseUrl: string;
  cookieSecret: string;
}

interface NeonAuthServer {
  getSession: () => Promise<{
    data?: {
      user?: {
        id?: string | null;
        email?: string | null;
        name?: string | null;
        image?: string | null;
      } | null;
    } | null;
    error?: unknown;
  }>;
  getAccessToken: () => Promise<{ data?: { token?: string | null } }>;
  getAnonymousToken?: () => Promise<{ data?: { token?: string | null } }>;
  handler: () => {
    GET: (request: Request, context: unknown) => Promise<Response>;
    POST: (request: Request, context: unknown) => Promise<Response>;
    PUT: (request: Request, context: unknown) => Promise<Response>;
    PATCH: (request: Request, context: unknown) => Promise<Response>;
    DELETE: (request: Request, context: unknown) => Promise<Response>;
  };
  middleware: (middlewareConfig?: { loginUrl?: string }) => (request: unknown) => Promise<unknown>;
}

let authSingleton: NeonAuthServer | null = null;
let authPromise: Promise<NeonAuthServer> | null = null;

export function getNeonAuthServerEnv(): NeonAuthServerEnv | null {
  const baseUrl = process.env.NEON_AUTH_BASE_URL?.trim();
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET?.trim();

  if (!baseUrl || !cookieSecret) {
    return null;
  }

  return { baseUrl, cookieSecret };
}

export function hasNeonAuthServerEnv() {
  return getNeonAuthServerEnv() !== null;
}

export async function getNeonAuthServer() {
  if (authSingleton) {
    return authSingleton;
  }

  if (authPromise) {
    return authPromise;
  }

  const env = getNeonAuthServerEnv();

  if (!env) {
    throw new Error(
      "Missing NEON_AUTH_BASE_URL or NEON_AUTH_COOKIE_SECRET.",
    );
  }

  authPromise = import("@neondatabase/auth/next/server")
    .then(({ createNeonAuth }) => {
      const auth = createNeonAuth({
        baseUrl: env.baseUrl,
        cookies: {
          secret: env.cookieSecret,
        },
      });

      authSingleton = auth as NeonAuthServer;
      return authSingleton;
    })
    .finally(() => {
      authPromise = null;
    });

  return authPromise;
}
