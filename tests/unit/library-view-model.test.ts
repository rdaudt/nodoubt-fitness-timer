import { describe, expect, it } from "vitest";

import { getLibraryViewModel } from "../../src/features/timers/server/get-library-view-model";

describe("library-view-model", () => {
  it("sorts signed-in timers by most recently updated and keeps draft labels", async () => {
    const viewModel = await getLibraryViewModel(undefined, {
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
      loadPersonalTimers: async () => [
        {
          id: "timer-older",
          detailHref: "/timers/timer-older",
          name: "Strength Ladder",
          description: null,
          draftLabel: null,
          intervalCount: 6,
          totalSeconds: 720,
          sourceLabel: "Saved timer",
          updatedAt: "2026-04-12T08:00:00.000Z",
        },
        {
          id: "timer-newer",
          detailHref: "/timers/timer-newer",
          name: "Mobility Reset Draft",
          description: null,
          draftLabel: "Draft",
          intervalCount: 4,
          totalSeconds: 420,
          sourceLabel: "Saved timer",
          updatedAt: "2026-04-15T08:00:00.000Z",
        },
      ],
    });

    expect(viewModel.authStatusLabel).toBe("Signed In");
    expect(viewModel.items.map((item) => item.id)).toEqual([
      "timer-newer",
      "timer-older",
    ]);
    expect(viewModel.items[0]?.draftLabel).toBe("Draft");
    expect(viewModel.statusSummary).toBe("2 timers sorted by recently updated.");
  });

  it("filters timers by case-insensitive name search", async () => {
    const viewModel = await getLibraryViewModel("mobility", {
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
      loadPersonalTimers: async () => [
        {
          id: "timer-a",
          detailHref: "/timers/timer-a",
          name: "Sprint Ladder",
          description: null,
          draftLabel: null,
          intervalCount: 6,
          totalSeconds: 720,
          sourceLabel: "Duplicated from official template",
          updatedAt: "2026-04-13T08:00:00.000Z",
        },
        {
          id: "timer-b",
          detailHref: "/timers/timer-b",
          name: "Mobility Reset Draft",
          description: null,
          draftLabel: "Draft",
          intervalCount: 4,
          totalSeconds: 420,
          sourceLabel: "Saved timer",
          updatedAt: "2026-04-15T08:00:00.000Z",
        },
      ],
    });

    expect(viewModel.searchQuery).toBe("mobility");
    expect(viewModel.items.map((item) => item.id)).toEqual(["timer-b"]);
    expect(viewModel.statusSummary).toBe('1 match for "mobility".');
  });

  it("keeps the library owner-scoped behind sign-in", async () => {
    const viewModel = await getLibraryViewModel(undefined, {
      getAuthContext: async () => ({
        kind: "guest",
        isAuthenticated: false,
        userId: null,
        email: null,
        profile: null,
      }),
      loadPersonalTimers: async () => {
        throw new Error("guest users should not load personal timers");
      },
    });

    expect(viewModel.authStatusLabel).toBe("Guest");
    expect(viewModel.items).toEqual([]);
    expect(viewModel.emptyStateTitle).toBe("Library unavailable for guests");
  });
});
