import { describe, expect, it } from "vitest";

import {
  buildTimerFromPreset,
  decodeGuestTimerSeed,
  encodeGuestTimerSeed,
} from "../../src/features/create/server/create-timer-from-preset";

function toFormData(values: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}

describe("create-entry", () => {
  it("creates a valid HIIT draft with generated naming and interval structure", () => {
    const input = buildTimerFromPreset(
      "hiit",
      toFormData({
        workSeconds: "50",
        restSeconds: "10",
        rounds: "4",
        warmupSeconds: "30",
        cooldownSeconds: "20",
      }),
    );

    expect(input.name).toBe("HIIT 50s / 10s x 4");
    expect(input.isDraft).toBe(true);
    expect(input.source).toBe("scratch");
    expect(input.intervals.length).toBe(9);
    expect(input.totalSeconds).toBe(280);
  });

  it("creates a valid Circuit/Tabata draft with repeated exercise blocks", () => {
    const input = buildTimerFromPreset(
      "circuit",
      toFormData({
        workSeconds: "30",
        restSeconds: "15",
        exercises: "3",
        rounds: "2",
        warmupSeconds: "0",
        cooldownSeconds: "45",
      }),
    );

    expect(input.name).toBe("Circuit 3 Moves x 2 Rounds");
    expect(input.intervals[0]?.id).toBe("round-1-exercise-1");
    expect(input.intervals.at(-1)?.id).toBe("cooldown");
    expect(input.totalSeconds).toBe(300);
  });

  it("creates a valid Round draft and preserves seed encode/decode for guest flow", () => {
    const input = buildTimerFromPreset(
      "round",
      toFormData({
        roundSeconds: "120",
        restSeconds: "30",
        rounds: "3",
        warmupSeconds: "60",
        cooldownSeconds: "60",
      }),
    );
    const seed = encodeGuestTimerSeed(input);
    const decoded = decodeGuestTimerSeed(seed);

    expect(input.name).toBe("Round 3 x 2:00");
    expect(input.totalSeconds).toBe(540);
    expect(decoded).toEqual(input);
  });
});
