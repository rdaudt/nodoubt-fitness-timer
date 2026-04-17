import { describe, expect, it } from "vitest";

import { getRunViewModel } from "../../src/features/run/server/get-run-view-model";
import { encodeGuestTimerSeed } from "../../src/features/create/server/create-timer-from-preset";

describe("run-view-model", () => {
  it("loads signed-in personal timer sources with a compiled run sequence", async () => {
    const viewModel = await getRunViewModel(
      {
        timerId: "timer-abc",
      },
      {
        getAuthContext: async () => ({
          kind: "signed-in",
          isAuthenticated: true,
          userId: "user-1",
          email: "runner@example.com",
          profile: {
            id: "user-1",
            firstName: "Runner",
            avatarUrl: null,
          },
        }),
        loadPersonalTimer: async () => ({
          id: "timer-abc",
          ownerId: "user-1",
          name: "Morning Session",
          description: "Fast set",
          isDraft: false,
          source: "scratch",
          sourceTemplateId: null,
          definitionVersion: 2,
          intervals: [
            { id: "work", label: "Work", kind: "work", durationSeconds: 30 },
          ],
          totalSeconds: 30,
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        }),
        loadOfficialTemplate: async () => null,
      },
    );

    expect(viewModel.state).toBe("ready");
    expect(viewModel.sequence?.sourceKind).toBe("personal-timer");
    expect(viewModel.sequence?.sourceRef).toBe("timer-abc");
    expect(viewModel.sequence?.definitionVersion).toBe(2);
  });

  it("loads official template and guest temporary sources safely", async () => {
    const templateModel = await getRunViewModel(
      {
        templateSlug: "starter-hiit",
      },
      {
        getAuthContext: async () => ({
          kind: "guest",
          isAuthenticated: false,
          userId: null,
          email: null,
          profile: null,
        }),
        loadPersonalTimer: async () => null,
        loadOfficialTemplate: async () => ({
          id: "template-1",
          slug: "starter-hiit",
          title: "Starter HIIT",
          summary: "Template summary",
          workoutType: "hiit",
          difficulty: "beginner",
          intervalCount: 1,
          totalSeconds: 45,
          intervals: [
            { id: "work-1", label: "Work", kind: "work", durationSeconds: 45 },
          ],
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        }),
      },
    );

    const guestSeed = encodeGuestTimerSeed({
      name: "Guest Draft",
      description: "temp",
      isDraft: true,
      source: "scratch",
      sourceTemplateId: null,
      intervals: [
        {
          id: "work-1",
          label: "Push",
          kind: "work",
          durationSeconds: 20,
        },
      ],
      totalSeconds: 20,
    });
    const guestModel = await getRunViewModel(
      {
        guestSeed,
      },
      {
        getAuthContext: async () => ({
          kind: "guest",
          isAuthenticated: false,
          userId: null,
          email: null,
          profile: null,
        }),
        loadPersonalTimer: async () => null,
        loadOfficialTemplate: async () => null,
      },
    );

    expect(templateModel.state).toBe("ready");
    expect(templateModel.sequence?.sourceKind).toBe("official-template");

    expect(guestModel.state).toBe("ready");
    expect(guestModel.sequence?.sourceKind).toBe("guest-temp");
    expect(guestModel.sequence?.title).toBe("Guest Draft");
  });

  it("keeps personal timer playback owner-safe for guests", async () => {
    const viewModel = await getRunViewModel(
      {
        timerId: "timer-private",
      },
      {
        getAuthContext: async () => ({
          kind: "guest",
          isAuthenticated: false,
          userId: null,
          email: null,
          profile: null,
        }),
        loadPersonalTimer: async () => {
          throw new Error("guest should not load personal timer");
        },
        loadOfficialTemplate: async () => null,
      },
    );

    expect(viewModel.state).toBe("access-restricted");
    expect(viewModel.sequence).toBeNull();
  });
});