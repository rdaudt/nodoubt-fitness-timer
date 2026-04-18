"use client";

import { useState } from "react";

import { createBrowser, hasNeonBrowserEnv } from "../../../../lib/neon/browser";

export function GoogleSignInButton() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isConfigured = hasNeonBrowserEnv();

  async function handleSignIn() {
    setErrorMessage(null);

    try {
      const neonAuth = createBrowser();
      const redirectTo = new URL("/", window.location.origin);

      const { error } = await neonAuth.signInWithOAuth({
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
          Add Neon auth env vars to enable Google sign-in.
        </p>
      ) : null}
      {errorMessage ? <p data-testid="google-sign-in-error">{errorMessage}</p> : null}
    </div>
  );
}
