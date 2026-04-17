import { describe, expect, it } from "vitest";

import { getEditorViewModel } from "../../src/features/editor/server/get-editor-view-model";
import { getLibraryViewModel } from "../../src/features/timers/server/get-library-view-model";
import { getPersonalTimerDetailViewModel } from "../../src/features/timers/server/get-timer-detail-view-model";

const signedInAuthContext = {
  kind: "signed-in" as const,
  isAuthenticated: true,
  userId: "user-1",
  email: "runner@example.com",
  profile: {
    id: "user-1",
    firstName: "Runner",
    avatarUrl: null,
  },
};

describe("run-edit-lock", () => {
  it("blocks editor readiness when active run marker matches the timer", async () => {
    const viewModel = await getEditorViewModel(
      "timer-1",
      undefined,
      {
        getAuthContext: async () => signedInAuthContext,
        loadTimerById: async () => ({
          id: "timer-1",
          ownerId: "user-1",
          name: "Sprint Ladder",
          description: null,
          isDraft: false,
          source: "scratch",
          sourceTemplateId: null,
          definitionVersion: 1,
          intervals: [
            { id: "work-1", label: "Work", kind: "work", durationSeconds: 30 },
          ],
          totalSeconds: 30,
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        }),
        readActiveRunMarker: async () => ({
          timerId: "timer-1",
          malformed: false,
        }),
      },
    );

    expect(viewModel.state).toBe("run-locked");
    expect(viewModel.initialState).toBeNull();
  });

  it("fails closed when active run marker is malformed", async () => {
    const viewModel = await getEditorViewModel(
      "timer-2",
      undefined,
      {
        getAuthContext: async () => signedInAuthContext,
        loadTimerById: async () => ({
          id: "timer-2",
          ownerId: "user-1",
          name: "Conditioning",
          description: null,
          isDraft: false,
          source: "scratch",
          sourceTemplateId: null,
          definitionVersion: 1,
          intervals: [
            { id: "work-1", label: "Work", kind: "work", durationSeconds: 20 },
          ],
          totalSeconds: 20,
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        }),
        readActiveRunMarker: async () => ({
          timerId: null,
          malformed: true,
        }),
      },
    );

    expect(viewModel.state).toBe("run-locked");
  });

  it("flags detail and library timer cards as edit-locked for active run timer", async () => {
    const detailViewModel = await getPersonalTimerDetailViewModel(
      "timer-3",
      undefined,
      {
        getAuthContext: async () => signedInAuthContext,
        loadTimerById: async () => ({
          id: "timer-3",
          ownerId: "user-1",
          name: "Tempo Builder",
          description: null,
          isDraft: true,
          source: "scratch",
          sourceTemplateId: null,
          definitionVersion: 1,
          intervals: [
            { id: "work-1", label: "Work", kind: "work", durationSeconds: 45 },
          ],
          totalSeconds: 45,
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        }),
        readActiveRunMarker: async () => ({
          timerId: "timer-3",
          malformed: false,
        }),
      },
    );

    const libraryViewModel = await getLibraryViewModel(
      undefined,
      {
        getAuthContext: async () => signedInAuthContext,
        loadPersonalTimers: async () => [
          {
            id: "timer-3",
            detailHref: "/timers/timer-3",
            name: "Tempo Builder",
            description: null,
            draftLabel: "Draft",
            intervalCount: 1,
            totalSeconds: 45,
            sourceLabel: "Saved timer",
            updatedAt: "2026-01-01T00:00:00.000Z",
            isEditLocked: false,
          },
          {
            id: "timer-4",
            detailHref: "/timers/timer-4",
            name: "Easy Flow",
            description: null,
            draftLabel: null,
            intervalCount: 1,
            totalSeconds: 60,
            sourceLabel: "Saved timer",
            updatedAt: "2026-01-02T00:00:00.000Z",
            isEditLocked: false,
          },
        ],
        readActiveRunMarker: async () => ({
          timerId: "timer-3",
          malformed: false,
        }),
      },
    );

    expect(detailViewModel.isEditLocked).toBe(true);
    expect(detailViewModel.editLockReason).toContain("Finish or reset");

    const activeCard = libraryViewModel.items.find((item) => item.id === "timer-3");
    const inactiveCard = libraryViewModel.items.find((item) => item.id === "timer-4");

    expect(activeCard?.isEditLocked).toBe(true);
    expect(inactiveCard?.isEditLocked).toBe(false);
  });
});
