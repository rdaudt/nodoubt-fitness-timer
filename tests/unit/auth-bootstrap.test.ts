import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/neon/server", () => ({
  createServer: vi.fn(),
  getMockAuthSession: vi.fn(),
}));

vi.mock("../../lib/neon/auth-server", () => ({
  getNeonAuthServer: vi.fn(),
  hasNeonAuthServerEnv: vi.fn(),
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
} from "../../lib/neon/server";
import {
  getNeonAuthServer,
  hasNeonAuthServerEnv,
} from "../../lib/neon/auth-server";
import { getAuthContext } from "../../src/features/auth/server/get-auth-context";
import {
  deriveFirstNameCandidate,
  ensureProfile,
} from "../../src/features/auth/server/ensure-profile";

describe("auth-bootstrap", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(hasNeonAuthServerEnv).mockReturnValue(false);
    vi.mocked(getMockAuthSession).mockResolvedValue(null);
  });

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

  it("returns guest state when Neon auth env is not configured", async () => {
    vi.mocked(getMockAuthSession).mockResolvedValue(null);
    vi.mocked(hasNeonAuthServerEnv).mockReturnValue(false);

    await expect(getAuthContext()).resolves.toEqual({
      kind: "guest",
      isAuthenticated: false,
      userId: null,
      email: null,
      profile: null,
    });
  });

  it("prefers the test cookie session over the live Neon auth session", async () => {
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
    vi.mocked(hasNeonAuthServerEnv).mockReturnValue(true);

    const getSession = vi.fn().mockResolvedValue({
      data: {
        user: {
          id: "user-42",
          email: "athlete@example.com",
          name: "Athlete Prime",
          image: null,
        },
      },
      error: null,
    });

    vi.mocked(getNeonAuthServer).mockResolvedValue({
      getSession,
    } as never);

    vi.mocked(createServer).mockResolvedValue({
      from: vi.fn(),
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
