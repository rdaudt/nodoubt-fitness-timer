import { describe, expect, it, vi } from "vitest";

vi.mock("../../lib/supabase/server", () => ({
  createServer: vi.fn(),
  getMockAuthSession: vi.fn(),
  getSupabaseEnv: vi.fn(),
}));

vi.mock(
  "../../src/features/auth/server/ensure-profile",
  async (importOriginal) => {
    const actual =
      await importOriginal<typeof import("../../src/features/auth/server/ensure-profile")>();

    return {
      ...actual,
      ensureProfile: vi.fn(),
    };
  },
);

import {
  createServer,
  getMockAuthSession,
  getSupabaseEnv,
} from "../../lib/supabase/server";
import { getAuthContext } from "../../src/features/auth/server/get-auth-context";
import {
  deriveFirstNameCandidate,
  ensureProfile,
} from "../../src/features/auth/server/ensure-profile";

describe("auth-bootstrap", () => {
  it("derives a first name from provider metadata before falling back", () => {
    expect(
      deriveFirstNameCandidate(
        {
          given_name: "Rita",
          full_name: "Rita Coach",
        },
        "ignored@example.com",
      ),
    ).toBe("Rita");
  });

  it("derives a safe display first name from the email local-part", () => {
    expect(deriveFirstNameCandidate({}, "coach.mode@example.com")).toBe(
      "Coach Mode",
    );
  });

  it("returns guest state when Supabase env is not configured", async () => {
    vi.mocked(getMockAuthSession).mockResolvedValue(null);
    vi.mocked(getSupabaseEnv).mockReturnValue(null);

    await expect(getAuthContext()).resolves.toEqual({
      kind: "guest",
      isAuthenticated: false,
      userId: null,
      email: null,
      profile: null,
    });
  });

  it("prefers the test cookie session over the live Supabase client", async () => {
    vi.mocked(getMockAuthSession).mockResolvedValue({
      userId: "mock-user",
      email: "mock@example.com",
      firstName: "Mock",
      avatarUrl: null,
    });

    await expect(getAuthContext()).resolves.toEqual({
      kind: "signed-in",
      isAuthenticated: true,
      userId: "mock-user",
      email: "mock@example.com",
      profile: {
        id: "mock-user",
        firstName: "Mock",
        avatarUrl: null,
      },
    });

    expect(createServer).not.toHaveBeenCalled();
  });

  it("builds signed-in state from the trusted user id and ensured profile", async () => {
    vi.mocked(getMockAuthSession).mockResolvedValue(null);
    vi.mocked(getSupabaseEnv).mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
    });

    const getUser = vi.fn().mockResolvedValue({
      data: {
        user: {
          id: "user-42",
          email: "athlete@example.com",
          user_metadata: {
            given_name: "Athlete",
          },
        },
      },
      error: null,
    });

    vi.mocked(createServer).mockResolvedValue({
      auth: {
        getUser,
      },
    } as never);

    vi.mocked(ensureProfile).mockResolvedValue({
      id: "user-42",
      firstName: "Avery",
      avatarUrl: null,
    });

    await expect(getAuthContext()).resolves.toEqual({
      kind: "signed-in",
      isAuthenticated: true,
      userId: "user-42",
      email: "athlete@example.com",
      profile: {
        id: "user-42",
        firstName: "Avery",
        avatarUrl: null,
      },
    });
  });
});
