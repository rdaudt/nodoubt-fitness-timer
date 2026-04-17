import { describe, expect, it } from "vitest";

import { compileRunSequence } from "../../src/features/run/engine/compile-run-sequence";

describe("run-sequence", () => {
  it("flattens intervals into deterministic cumulative boundaries", () => {
    const sequence = compileRunSequence({
      title: "Sprint Ladder",
      sourceKind: "personal-timer",
      sourceRef: "timer-123",
      definitionVersion: 3,
      prepSeconds: 4,
      intervals: [
        {
          id: "warmup",
          label: "Warm up",
          kind: "warmup",
          durationSeconds: 30,
        },
        {
          id: "work-1",
          label: "Sprint",
          kind: "work",
          durationSeconds: 20,
        },
        {
          id: "rest-1",
          label: "Recover",
          kind: "rest",
          durationSeconds: 10,
        },
      ],
    });

    expect(sequence.id).toBe("personal-timer:timer-123:v3");
    expect(sequence.prepDurationMs).toBe(4_000);
    expect(sequence.activeDurationMs).toBe(60_000);
    expect(sequence.totalDurationMs).toBe(64_000);
    expect(sequence.intervals.map((interval) => interval.startMs)).toEqual([
      0,
      30_000,
      50_000,
    ]);
    expect(sequence.intervals.map((interval) => interval.endMs)).toEqual([
      30_000,
      50_000,
      60_000,
    ]);
  });

  it("keeps source metadata stable for template and guest playback", () => {
    const templateSequence = compileRunSequence({
      title: "Starter HIIT",
      sourceKind: "official-template",
      sourceRef: "starter-hiit",
      intervals: [
        {
          id: "work-1",
          label: "Round 1",
          kind: "work",
          durationSeconds: 45,
        },
      ],
    });
    const guestSequence = compileRunSequence({
      title: "Guest Draft",
      sourceKind: "guest-temp",
      sourceRef: "seed-1",
      prepSeconds: 0,
      intervals: [
        {
          id: "work-1",
          label: "Go",
          kind: "work",
          durationSeconds: 15,
        },
      ],
    });

    expect(templateSequence.sourceKind).toBe("official-template");
    expect(templateSequence.sourceRef).toBe("starter-hiit");
    expect(templateSequence.prepDurationMs).toBe(5_000);

    expect(guestSequence.sourceKind).toBe("guest-temp");
    expect(guestSequence.prepDurationMs).toBe(0);
    expect(guestSequence.totalDurationMs).toBe(15_000);
  });
});