import { describe, expect, it } from "vitest";

import { getHomeViewModel } from "../../src/features/home/server/get-home-view-model";

describe("home-view-model", () => {
  it("prioritizes official templates for guests without creating sign-in pressure", async () => {
    const viewModel = await getHomeViewModel({
      getAuthContext: async () => ({
        kind: "guest",
        isAuthenticated: false,
        userId: null,
        email: null,
        profile: null,
      }),
      loadOfficialTemplates: async () => [
        {
          id: "template-1",
          slug: "starter",
          title: "Starter",
          summary: "Guest-visible starter",
          workoutType: "hiit",
          intervalCount: 6,
          totalSeconds: 600,
        },
      ],
      loadPersonalTimers: async () => [],
    });

    expect(viewModel.authStatusLabel).toBe("Guest");
    expect(viewModel.showGoogleSignIn).toBe(true);
    expect(viewModel.profile).toBeNull();
    expect(viewModel.sections.map((section) => section.kind)).toEqual([
      "official-templates",
    ]);
  });

  it("prioritizes my timers first for signed-in users while preserving official templates", async () => {
    const viewModel = await getHomeViewModel({
      getAuthContext: async () => ({
        kind: "signed-in",
        isAuthenticated: true,
        userId: "user-42",
        email: "rita@example.com",
        profile: {
          id: "user-42",
          firstName: "Rita",
          avatarUrl: null,
        },
      }),
      loadOfficialTemplates: async () => [
        {
          id: "template-1",
          slug: "starter",
          title: "Starter",
          summary: "Official starter",
          workoutType: "strength",
          intervalCount: 8,
          totalSeconds: 720,
        },
      ],
      loadPersonalTimers: async () => [
        {
          id: "timer-1",
          name: "Monday Burn",
          isDraft: false,
          totalSeconds: 1200,
          sourceLabel: "Saved timer",
        },
      ],
    });

    expect(viewModel.authStatusLabel).toBe("Signed In");
    expect(viewModel.profile?.firstName).toBe("Rita");
    expect(viewModel.showGoogleSignIn).toBe(false);
    expect(viewModel.sections.map((section) => section.kind)).toEqual([
      "my-timers",
      "official-templates",
    ]);
    expect(viewModel.sections[0]?.kind).toBe("my-timers");
    expect(viewModel.sections[1]?.kind).toBe("official-templates");
  });
});
