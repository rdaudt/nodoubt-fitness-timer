"use client";

import { useState } from "react";

import { createBrowser, hasSupabaseBrowserEnv } from "../../../../lib/supabase/browser";

export function GoogleSignInButton() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isConfigured = hasSupabaseBrowserEnv();

  async function handleSignIn() {
    setErrorMessage(null);

    try {
      const supabase = createBrowser();
      const redirectTo = new URL("/auth/callback", window.location.origin);
      redirectTo.searchParams.set("next", "/");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo.toString(),
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start Google sign-in.",
      );
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleSignIn()}
        disabled={!isConfigured}
        data-testid="google-sign-in-button"
      >
        Continue with Google
      </button>
      {!isConfigured ? (
        <p data-testid="auth-env-hint">
          Add the public Supabase env vars to enable Google sign-in.
        </p>
      ) : null}
      {errorMessage ? <p data-testid="google-sign-in-error">{errorMessage}</p> : null}
    </div>
  );
}
