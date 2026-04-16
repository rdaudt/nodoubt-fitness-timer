export type TimerIntervalKind = "warmup" | "work" | "rest" | "cooldown";

export interface TimerIntervalBlock {
  id: string;
  label: string;
  kind: TimerIntervalKind;
  durationSeconds: number;
  repeatGroupId?: string | null;
}

export type PersonalTimerSource = "scratch" | "official-template";

export interface TimerRecord {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  isDraft: boolean;
  source: PersonalTimerSource;
  sourceTemplateId: string | null;
  definitionVersion: number;
  intervals: TimerIntervalBlock[];
  totalSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface TimerRecordInput {
  name: string;
  description?: string | null;
  isDraft?: boolean;
  source?: PersonalTimerSource;
  sourceTemplateId?: string | null;
  intervals: TimerIntervalBlock[];
  totalSeconds: number;
}
