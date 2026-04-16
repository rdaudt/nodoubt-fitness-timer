import type { TimerRecordInput } from "../../timers/contracts/timer-record";
import { decodeGuestTimerSeed } from "./create-timer-from-preset";

export interface CustomDraftState {
  tempId: string;
  timer: TimerRecordInput;
  updatedAt: string;
  seededFromPreset: boolean;
}

function buildDefaultCustomTimer(): TimerRecordInput {
  return {
    name: "Custom Workout",
    description: "Start a custom timer here, then refine intervals in the editor flow.",
    isDraft: true,
    source: "scratch",
    intervals: [
      {
        id: "warmup",
        label: "Warm up",
        kind: "warmup",
        durationSeconds: 60,
      },
      {
        id: "main-work",
        label: "Main effort",
        kind: "work",
        durationSeconds: 45,
      },
      {
        id: "main-rest",
        label: "Rest",
        kind: "rest",
        durationSeconds: 20,
      },
      {
        id: "cooldown",
        label: "Cooldown",
        kind: "cooldown",
        durationSeconds: 60,
      },
    ],
    totalSeconds: 185,
  };
}

export function createCustomDraftState(
  seed: string | null | undefined,
): CustomDraftState {
  const decodedSeed = decodeGuestTimerSeed(seed);

  return {
    tempId: `guest-temp-${crypto.randomUUID()}`,
    timer: decodedSeed ?? buildDefaultCustomTimer(),
    updatedAt: new Date().toISOString(),
    seededFromPreset: Boolean(decodedSeed),
  };
}
