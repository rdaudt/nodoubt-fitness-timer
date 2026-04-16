import type { AuthContext } from "../server/get-auth-context";
import { GoogleSignInButton } from "./google-sign-in-button";

interface SessionBoundaryProps {
  authContext: AuthContext;
}

export function SessionBoundary({ authContext }: SessionBoundaryProps) {
  if (authContext.kind === "guest") {
    return (
      <main>
        <p data-testid="auth-status">Guest</p>
        <h1>No Doubt Fitness Timer</h1>
        <p>
          Guests can open the app, browse official templates later in Phase 1, and
          only sign in when they want save-and-return behavior.
        </p>
        <GoogleSignInButton />
      </main>
    );
  }

  return (
    <main>
      <header>
        <p data-testid="auth-status">Signed In</p>
        <p data-testid="profile-chip">{authContext.profile.firstName}</p>
      </header>
      <h1>No Doubt Fitness Timer</h1>
      <p data-testid="signed-in-email">
        {authContext.email ?? "Signed in with Supabase Auth"}
      </p>
      <p>
        Signed-in shell state is server-rendered from auth identity and profile
        context instead of relying on client-only session memory.
      </p>
    </main>
  );
}
