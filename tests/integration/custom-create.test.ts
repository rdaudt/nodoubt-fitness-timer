import { describe, expect, it } from "vitest";

import { createCustomDraftState } from "../../src/features/create/server/create-custom-draft";
import {
  clearGuestTempTimer,
  hasGuestTempTimer,
  readGuestTempTimer,
  writeGuestTempTimer,
  type GuestTempTimerDraft,
} from "../../src/features/guest-temp/client/temp-timer-store";

interface MockStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

function createStorage(): MockStorage {
  const map = new Map<string, string>();

  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

describe("custom-create", () => {
  it("creates a default custom draft when no seed is provided", () => {
    const state = createCustomDraftState(null);

    expect(state.seededFromPreset).toBe(false);
    expect(state.timer.name).toBe("Custom Workout");
    expect(state.timer.intervals.length).toBeGreaterThan(0);
  });

  it("hydrates custom draft from a seeded quick-create payload", () => {
    const seedPayload = {
      name: "Seeded HIIT Draft",
      description: "From quick-create flow",
      isDraft: true,
      source: "scratch" as const,
      intervals: [
        {
          id: "warmup",
          label: "Warm up",
          kind: "warmup" as const,
          durationSeconds: 30,
        },
        {
          id: "work-1",
          label: "Work",
          kind: "work" as const,
          durationSeconds: 45,
        },
      ],
      totalSeconds: 75,
    };
    const seed = Buffer.from(JSON.stringify(seedPayload), "utf8").toString(
      "base64url",
    );
    const state = createCustomDraftState(seed);

    expect(state.seededFromPreset).toBe(true);
    expect(state.timer).toEqual(seedPayload);
  });

  it("persists and clears guest temporary timer state", () => {
    const storage = createStorage();
    const draft: GuestTempTimerDraft = {
      tempId: "guest-temp-1",
      updatedAt: "2026-04-16T00:00:00.000Z",
      timer: {
        name: "Guest Draft",
        description: "Temporary timer",
        isDraft: true,
        source: "scratch",
        intervals: [
          {
            id: "work-1",
            label: "Work",
            kind: "work",
            durationSeconds: 45,
          },
        ],
        totalSeconds: 45,
      },
    };

    writeGuestTempTimer(draft, storage);
    expect(hasGuestTempTimer(storage)).toBe(true);
    expect(readGuestTempTimer(storage)?.timer.name).toBe("Guest Draft");

    clearGuestTempTimer(storage);
    expect(hasGuestTempTimer(storage)).toBe(false);
  });
});
