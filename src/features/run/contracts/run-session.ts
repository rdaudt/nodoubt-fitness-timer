import type { RunSourceKind } from "./run-sequence";

export type RunPlaybackStatus = "running" | "paused" | "completed";

export interface RunSessionSnapshot {
  sessionId: string;
  sequenceId: string;
  sourceKind: RunSourceKind;
  sourceRef: string;
  status: RunPlaybackStatus;
  anchorMonotonicMs: number;
  totalPausedMs: number;
  pausedAtMonotonicMs: number | null;
  manualOffsetMs: number;
  startedAtEpochMs: number;
  lastElapsedMs: number;
  updatedAtEpochMs: number;
}

export function isRunPlaybackStatus(value: unknown): value is RunPlaybackStatus {
  return value === "running" || value === "paused" || value === "completed";
}