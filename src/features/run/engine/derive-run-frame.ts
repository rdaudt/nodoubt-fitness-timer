import type {
  RunSequence,
  RunSequenceInterval,
} from "../contracts/run-sequence";

export type RunFrameState = "prep" | "running" | "completed";

export interface RunFrame {
  state: RunFrameState;
  elapsedMs: number;
  elapsedActiveMs: number;
  totalRemainingMs: number;
  currentInterval: RunSequenceInterval | null;
  nextInterval: RunSequenceInterval | null;
  progress: {
    currentIndex: number;
    totalIntervals: number;
    elapsedInIntervalMs: number;
    intervalRemainingMs: number;
    intervalProgress: number;
    totalProgress: number;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function findIntervalByOffset(
  intervals: RunSequence["intervals"],
  activeElapsedMs: number,
): RunSequenceInterval | null {
  for (const interval of intervals) {
    if (activeElapsedMs >= interval.startMs && activeElapsedMs < interval.endMs) {
      return interval;
    }
  }

  return null;
}

export function deriveRunFrame(sequence: RunSequence, elapsedMs: number): RunFrame {
  const clampedElapsedMs = clamp(elapsedMs, 0, sequence.totalDurationMs);
  const totalRemainingMs = Math.max(0, sequence.totalDurationMs - clampedElapsedMs);

  if (clampedElapsedMs < sequence.prepDurationMs) {
    return {
      state: "prep",
      elapsedMs: clampedElapsedMs,
      elapsedActiveMs: 0,
      totalRemainingMs,
      currentInterval: null,
      nextInterval: sequence.intervals[0] ?? null,
      progress: {
        currentIndex: -1,
        totalIntervals: sequence.intervals.length,
        elapsedInIntervalMs: clampedElapsedMs,
        intervalRemainingMs: sequence.prepDurationMs - clampedElapsedMs,
        intervalProgress:
          sequence.prepDurationMs > 0
            ? clampedElapsedMs / sequence.prepDurationMs
            : 1,
        totalProgress:
          sequence.totalDurationMs > 0
            ? clampedElapsedMs / sequence.totalDurationMs
            : 1,
      },
    };
  }

  if (clampedElapsedMs >= sequence.totalDurationMs || sequence.intervals.length === 0) {
    return {
      state: "completed",
      elapsedMs: clampedElapsedMs,
      elapsedActiveMs: sequence.activeDurationMs,
      totalRemainingMs: 0,
      currentInterval: sequence.intervals.at(-1) ?? null,
      nextInterval: null,
      progress: {
        currentIndex: sequence.intervals.length - 1,
        totalIntervals: sequence.intervals.length,
        elapsedInIntervalMs: sequence.intervals.at(-1)?.durationMs ?? 0,
        intervalRemainingMs: 0,
        intervalProgress: 1,
        totalProgress: 1,
      },
    };
  }

  const activeElapsedMs = clampedElapsedMs - sequence.prepDurationMs;
  const currentInterval = findIntervalByOffset(sequence.intervals, activeElapsedMs);

  if (!currentInterval) {
    return {
      state: "completed",
      elapsedMs: clampedElapsedMs,
      elapsedActiveMs: sequence.activeDurationMs,
      totalRemainingMs: 0,
      currentInterval: sequence.intervals.at(-1) ?? null,
      nextInterval: null,
      progress: {
        currentIndex: sequence.intervals.length - 1,
        totalIntervals: sequence.intervals.length,
        elapsedInIntervalMs: sequence.intervals.at(-1)?.durationMs ?? 0,
        intervalRemainingMs: 0,
        intervalProgress: 1,
        totalProgress: 1,
      },
    };
  }

  const elapsedInIntervalMs = activeElapsedMs - currentInterval.startMs;
  const intervalRemainingMs = currentInterval.endMs - activeElapsedMs;

  return {
    state: "running",
    elapsedMs: clampedElapsedMs,
    elapsedActiveMs: activeElapsedMs,
    totalRemainingMs,
    currentInterval,
    nextInterval: sequence.intervals[currentInterval.index + 1] ?? null,
    progress: {
      currentIndex: currentInterval.index,
      totalIntervals: sequence.intervals.length,
      elapsedInIntervalMs,
      intervalRemainingMs,
      intervalProgress:
        currentInterval.durationMs > 0
          ? elapsedInIntervalMs / currentInterval.durationMs
          : 1,
      totalProgress:
        sequence.totalDurationMs > 0
          ? clampedElapsedMs / sequence.totalDurationMs
          : 1,
    },
  };
}