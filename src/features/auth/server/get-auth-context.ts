import {
  createServer,
  getMockAuthSession,
} from "../../../../lib/neon/server";
import {
  getNeonAuthServer,
  hasNeonAuthServerEnv,
} from "../../../../lib/neon/auth-server";
import type { ProfileDisplayRecord } from "../../profiles/contracts/profile";
import { ensureProfile } from "./ensure-profile";

export interface GuestAuthContext {
  kind: "guest";
  isAuthenticated: false;
  userId: null;
  email: null;
  profile: null;
}

export interface SignedInAuthContext {
  kind: "signed-in";
  isAuthenticated: true;
  userId: string;
  email: string | null;
  profile: ProfileDisplayRecord;
}

export type AuthContext = GuestAuthContext | SignedInAuthContext;

interface AuthenticatedUser {
  id: string;
  email: string | null | undefined;
  user_metadata?: Record<string, unknown> | null;
}

function guestAuthContext(): GuestAuthContext {
  return {
    kind: "guest",
    isAuthenticated: false,
    userId: null,
    email: null,
    profile: null,
  };
}

function signedInAuthContext(
  user: Pick<AuthenticatedUser, "id" | "email">,
  profile: ProfileDisplayRecord,
): SignedInAuthContext {
  return {
    kind: "signed-in",
    isAuthenticated: true,
    userId: user.id,
    email: user.email ?? null,
    profile,
  };
}

export async function getAuthContext(): Promise<AuthContext> {
  const mockSession = await getMockAuthSession();

  if (mockSession) {
    return signedInAuthContext(
      {
        id: mockSession.userId,
        email: mockSession.email,
      },
      {
        id: mockSession.userId,
        firstName: mockSession.firstName?.trim() || "Athlete",
        avatarUrl: mockSession.avatarUrl,
      },
    );
  }

  if (!hasNeonAuthServerEnv()) {
    return guestAuthContext();
  }

  const auth = await getNeonAuthServer();
  const { data, error } = await auth.getSession();
  const user = data?.user;

  if (error || !user?.id) {
    return guestAuthContext();
  }

  const database = await createServer();
  const profile = await ensureProfile(database, {
    id: user.id,
    email: user.email,
    user_metadata: {
      full_name: user.name ?? null,
      picture: user.image ?? null,
    },
  });

  return signedInAuthContext(
    {
      id: user.id,
      email: user.email ?? null,
    },
    profile,
  );
}
