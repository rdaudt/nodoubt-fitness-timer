import { describe, expect, it } from "vitest";

import {
  buildTimerFromPreset,
  decodeGuestTimerSeed,
  encodeGuestTimerSeed,
} from "../../src/features/create/server/create-timer-from-preset";

function buildFormData(entries: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value);
  }

  return formData;
}

describe("create-entry", () => {
  it("builds a hiit draft with a default generated name", () => {
    const input = buildTimerFromPreset(
      "hiit",
      buildFormData({
        workSeconds: "45",
        restSeconds: "15",
        rounds: "8",
        warmupSeconds: "60",
        cooldownSeconds: "60",
      }),
    );

    expect(input.name).toBe("HIIT 45s / 15s x 8");
    expect(input.isDraft).toBe(true);
    expect(input.intervals[0]?.kind).toBe("warmup");
    expect(input.intervals.at(-1)?.kind).toBe("cooldown");
    expect(input.totalSeconds).toBe(60 + 8 * 45 + 7 * 15 + 60);
  });

  it("builds a circuit draft that includes exercise repetitions across rounds", () => {
    const input = buildTimerFromPreset(
      "circuit",
      buildFormData({
        workSeconds: "40",
        restSeconds: "20",
        exercises: "4",
        rounds: "3",
        warmupSeconds: "90",
        cooldownSeconds: "60",
      }),
    );

    expect(input.name).toBe("Circuit 4 Moves x 3 Rounds");
    expect(
      input.intervals.filter((interval) => interval.kind === "work").length,
    ).toBe(12);
    expect(input.totalSeconds).toBe(90 + 12 * 40 + 11 * 20 + 60);
  });

  it("builds a round draft with round/rest cadence and an encoded guest seed", () => {
    const input = buildTimerFromPreset(
      "round",
      buildFormData({
        roundSeconds: "180",
        restSeconds: "60",
        rounds: "5",
        warmupSeconds: "60",
        cooldownSeconds: "60",
      }),
    );
    const encoded = encodeGuestTimerSeed(input);
    const decoded = decodeGuestTimerSeed(encoded);

    expect(input.name).toBe("Round 5 x 3:00");
    expect(input.intervals[1]?.label).toBe("Round 1");
    expect(decoded?.name).toBe("Round 5 x 3:00");
    expect(decoded?.intervals.at(-1)?.kind).toBe("cooldown");
  });
});
