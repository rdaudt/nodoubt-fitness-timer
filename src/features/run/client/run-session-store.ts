"use client";

import {
  isRunPlaybackStatus,
  type RunSessionSnapshot,
} from "../contracts/run-session";
import type { RunSequence } from "../contracts/run-sequence";

export const RUN_SESSION_STORAGE_KEY = "ndft.active-run-session";

export interface StorageLike {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

function resolveStorage(storage?: StorageLike | null): StorageLike | null {
  if (storage) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function createRunSessionSnapshot(
  sequence: RunSequence,
  nowMonotonicMs: number,
  nowEpochMs: number,
): RunSessionSnapshot {
  return {
    sessionId: crypto.randomUUID(),
    sequenceId: sequence.id,
    sourceKind: sequence.sourceKind,
    sourceRef: sequence.sourceRef,
    status: "running",
    anchorMonotonicMs: nowMonotonicMs,
    totalPausedMs: 0,
    pausedAtMonotonicMs: null,
    manualOffsetMs: 0,
    startedAtEpochMs: nowEpochMs,
    lastElapsedMs: 0,
    updatedAtEpochMs: nowEpochMs,
  };
}

export function readRunSessionSnapshot(
  storage?: StorageLike | null,
): RunSessionSnapshot | null {
  const targetStorage = resolveStorage(storage);

  if (!targetStorage) {
    return null;
  }

  const rawValue = targetStorage.getItem(RUN_SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<RunSessionSnapshot>;

    if (
      typeof parsed.sessionId !== "string" ||
      typeof parsed.sequenceId !== "string" ||
      (parsed.sourceKind !== "personal-timer" &&
        parsed.sourceKind !== "official-template" &&
        parsed.sourceKind !== "guest-temp") ||
      typeof parsed.sourceRef !== "string" ||
      !isRunPlaybackStatus(parsed.status) ||
      !isFiniteNumber(parsed.anchorMonotonicMs) ||
      !isFiniteNumber(parsed.totalPausedMs) ||
      !(parsed.pausedAtMonotonicMs === null ||
        isFiniteNumber(parsed.pausedAtMonotonicMs)) ||
      !isFiniteNumber(parsed.manualOffsetMs) ||
      !isFiniteNumber(parsed.startedAtEpochMs) ||
      !isFiniteNumber(parsed.lastElapsedMs) ||
      !isFiniteNumber(parsed.updatedAtEpochMs)
    ) {
      return null;
    }

    return parsed as RunSessionSnapshot;
  } catch {
    return null;
  }
}

export function writeRunSessionSnapshot(
  snapshot: RunSessionSnapshot,
  storage?: StorageLike | null,
): boolean {
  const targetStorage = resolveStorage(storage);

  if (!targetStorage) {
    return false;
  }

  targetStorage.setItem(RUN_SESSION_STORAGE_KEY, JSON.stringify(snapshot));

  return true;
}

export function clearRunSessionSnapshot(storage?: StorageLike | null): boolean {
  const targetStorage = resolveStorage(storage);

  if (!targetStorage) {
    return false;
  }

  targetStorage.removeItem(RUN_SESSION_STORAGE_KEY);

  return true;
}