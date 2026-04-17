import type { TimerIntervalBlock } from "../../timers/contracts/timer-record";

export type RunSourceKind =
  | "personal-timer"
  | "official-template"
  | "guest-temp";

export interface RunSequenceInterval {
  id: string;
  label: string;
  kind: TimerIntervalBlock["kind"];
  durationMs: number;
  startMs: number;
  endMs: number;
  index: number;
  total: number;
}

export interface RunSequence {
  id: string;
  title: string;
  sourceKind: RunSourceKind;
  sourceRef: string;
  definitionVersion: number;
  prepDurationMs: number;
  activeDurationMs: number;
  totalDurationMs: number;
  intervals: RunSequenceInterval[];
}

export interface CompileRunSequenceInput {
  title: string;
  sourceKind: RunSourceKind;
  sourceRef: string;
  definitionVersion?: number;
  prepSeconds?: number;
  intervals: TimerIntervalBlock[];
}