import type { User } from "@supabase/supabase-js";

import {
  createServer,
  getMockAuthSession,
  getSupabaseEnv,
} from "../../../../lib/supabase/server";
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

type AuthenticatedUser = Pick<User, "id" | "email" | "user_metadata">;

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

  if (!getSupabaseEnv()) {
    return guestAuthContext();
  }

  const supabase = await createServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return guestAuthContext();
  }

  const profile = await ensureProfile(supabase, user);

  return signedInAuthContext(user, profile);
}
