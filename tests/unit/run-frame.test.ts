import { describe, expect, it } from "vitest";

import { applyRunControlAction } from "../../src/features/run/client/use-run-engine";
import { compileRunSequence } from "../../src/features/run/engine/compile-run-sequence";
import { deriveRunFrame } from "../../src/features/run/engine/derive-run-frame";

function createClock(monotonicMs: number, epochMs: number) {
  return {
    nowMonotonicMs: () => monotonicMs,
    nowEpochMs: () => epochMs,
  };
}

describe("run-frame", () => {
  const sequence = compileRunSequence({
    title: "Deterministic Timer",
    sourceKind: "personal-timer",
    sourceRef: "timer-1",
    prepSeconds: 5,
    intervals: [
      { id: "work-1", label: "Work 1", kind: "work", durationSeconds: 30 },
      { id: "rest-1", label: "Rest 1", kind: "rest", durationSeconds: 15 },
      { id: "work-2", label: "Work 2", kind: "work", durationSeconds: 45 },
    ],
  });

  it("derives prep, active, and completion boundaries from absolute elapsed time", () => {
    const prepFrame = deriveRunFrame(sequence, 3_000);
    const activeFrame = deriveRunFrame(sequence, 6_000);
    const boundaryFrame = deriveRunFrame(sequence, 35_000);
    const doneFrame = deriveRunFrame(sequence, 95_000);

    expect(prepFrame.state).toBe("prep");
    expect(prepFrame.nextInterval?.id).toBe("work-1");

    expect(activeFrame.state).toBe("running");
    expect(activeFrame.currentInterval?.id).toBe("work-1");
    expect(activeFrame.nextInterval?.id).toBe("rest-1");

    expect(boundaryFrame.currentInterval?.id).toBe("rest-1");
    expect(boundaryFrame.progress.currentIndex).toBe(1);

    expect(doneFrame.state).toBe("completed");
    expect(doneFrame.totalRemainingMs).toBe(0);
    expect(doneFrame.progress.totalProgress).toBe(1);
  });

  it("keeps pause/resume and interval jumps deterministic without drift", () => {
    const initialSession = {
      sessionId: "session-1",
      sequenceId: sequence.id,
      sourceKind: sequence.sourceKind,
      sourceRef: sequence.sourceRef,
      status: "running" as const,
      anchorMonotonicMs: 1_000,
      totalPausedMs: 0,
      pausedAtMonotonicMs: null,
      manualOffsetMs: 0,
      startedAtEpochMs: 10_000,
      lastElapsedMs: 0,
      updatedAtEpochMs: 10_000,
    };

    const paused = applyRunControlAction(
      sequence,
      initialSession,
      { type: "pause" },
      createClock(8_000, 20_000),
    );
    const resumed = applyRunControlAction(
      sequence,
      paused,
      { type: "resume" },
      createClock(12_000, 24_000),
    );
    const jumpedNext = applyRunControlAction(
      sequence,
      resumed,
      { type: "jump", targetElapsedMs: 35_000 },
      createClock(13_000, 25_000),
    );
    const reset = applyRunControlAction(
      sequence,
      jumpedNext,
      { type: "reset" },
      createClock(16_000, 30_000),
    );

    expect(paused.status).toBe("paused");
    expect(paused.lastElapsedMs).toBe(7_000);

    expect(resumed.status).toBe("running");
    expect(resumed.totalPausedMs).toBe(4_000);

    expect(jumpedNext.manualOffsetMs).toBeGreaterThan(0);
    expect(jumpedNext.lastElapsedMs).toBe(35_000);

    expect(reset.status).toBe("running");
    expect(reset.anchorMonotonicMs).toBe(16_000);
    expect(reset.manualOffsetMs).toBe(0);
    expect(reset.totalPausedMs).toBe(0);
  });
});