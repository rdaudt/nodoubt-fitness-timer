import {
  createServer,
  getNeonEnv,
  isAuthTestMode,
} from "../../../../lib/neon/server";
import type { SignedInAuthContext } from "../../auth/server/get-auth-context";
import type { TimerIntervalBlock, TimerRecordInput } from "../../timers/contracts/timer-record";
import {
  buildPersonalTimerInsert,
  insertMockPersonalTimerRow,
} from "../../timers/repositories/personal-timers";

export type CreatePresetKind = "hiit" | "circuit" | "round";

export interface CreatedTimerResult {
  timerId: string;
  notice: string;
}

function readPositiveInteger(
  formData: FormData,
  fieldName: string,
  fallbackValue: number,
  options: { min?: number; max?: number } = {},
) {
  const parsedValue = Number.parseInt(String(formData.get(fieldName) ?? ""), 10);

  if (!Number.isFinite(parsedValue)) {
    return fallbackValue;
  }

  const min = options.min ?? 1;
  const max = options.max ?? 3_600;

  return Math.min(Math.max(parsedValue, min), max);
}

function appendInterval(
  intervals: TimerIntervalBlock[],
  interval: TimerIntervalBlock | null,
) {
  if (interval) {
    intervals.push(interval);
  }
}

function toTotalSeconds(intervals: TimerIntervalBlock[]) {
  return intervals.reduce((sum, interval) => sum + interval.durationSeconds, 0);
}

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  if (!minutes) {
    return `${remainder}s`;
  }

  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function buildHiitInput(formData: FormData): TimerRecordInput {
  const workSeconds = readPositiveInteger(formData, "workSeconds", 45, {
    min: 5,
    max: 600,
  });
  const restSeconds = readPositiveInteger(formData, "restSeconds", 15, {
    min: 5,
    max: 600,
  });
  const rounds = readPositiveInteger(formData, "rounds", 8, {
    min: 1,
    max: 30,
  });
  const warmupSeconds = readPositiveInteger(formData, "warmupSeconds", 60, {
    min: 0,
    max: 900,
  });
  const cooldownSeconds = readPositiveInteger(formData, "cooldownSeconds", 60, {
    min: 0,
    max: 900,
  });
  const intervals: TimerIntervalBlock[] = [];

  appendInterval(
    intervals,
    warmupSeconds > 0
      ? {
          id: "warmup",
          label: "Warm up",
          kind: "warmup",
          durationSeconds: warmupSeconds,
        }
      : null,
  );

  for (let roundIndex = 1; roundIndex <= rounds; roundIndex += 1) {
    intervals.push({
      id: `work-${roundIndex}`,
      label: `Round ${roundIndex} Work`,
      kind: "work",
      durationSeconds: workSeconds,
    });

    appendInterval(
      intervals,
      roundIndex < rounds && restSeconds > 0
        ? {
            id: `rest-${roundIndex}`,
            label: `Round ${roundIndex} Rest`,
            kind: "rest",
            durationSeconds: restSeconds,
          }
        : null,
    );
  }

  appendInterval(
    intervals,
    cooldownSeconds > 0
      ? {
          id: "cooldown",
          label: "Cooldown",
          kind: "cooldown",
          durationSeconds: cooldownSeconds,
        }
      : null,
  );

  return {
    name: `HIIT ${workSeconds}s / ${restSeconds}s x ${rounds}`,
    description: "Quick-created HIIT timer.",
    isDraft: true,
    source: "scratch",
    intervals,
    totalSeconds: toTotalSeconds(intervals),
  };
}

function buildCircuitInput(formData: FormData): TimerRecordInput {
  const workSeconds = readPositiveInteger(formData, "workSeconds", 40, {
    min: 5,
    max: 600,
  });
  const restSeconds = readPositiveInteger(formData, "restSeconds", 20, {
    min: 0,
    max: 600,
  });
  const exercises = readPositiveInteger(formData, "exercises", 5, {
    min: 1,
    max: 20,
  });
  const rounds = readPositiveInteger(formData, "rounds", 3, {
    min: 1,
    max: 20,
  });
  const warmupSeconds = readPositiveInteger(formData, "warmupSeconds", 90, {
    min: 0,
    max: 900,
  });
  const cooldownSeconds = readPositiveInteger(formData, "cooldownSeconds", 60, {
    min: 0,
    max: 900,
  });
  const intervals: TimerIntervalBlock[] = [];

  appendInterval(
    intervals,
    warmupSeconds > 0
      ? {
          id: "warmup",
          label: "Warm up",
          kind: "warmup",
          durationSeconds: warmupSeconds,
        }
      : null,
  );

  for (let roundIndex = 1; roundIndex <= rounds; roundIndex += 1) {
    for (let exerciseIndex = 1; exerciseIndex <= exercises; exerciseIndex += 1) {
      intervals.push({
        id: `round-${roundIndex}-exercise-${exerciseIndex}`,
        label: `Round ${roundIndex} Exercise ${exerciseIndex}`,
        kind: "work",
        durationSeconds: workSeconds,
      });

      const isFinalExercise =
        roundIndex === rounds && exerciseIndex === exercises;

      appendInterval(
        intervals,
        !isFinalExercise && restSeconds > 0
          ? {
              id: `round-${roundIndex}-rest-${exerciseIndex}`,
              label: `Recovery ${exerciseIndex}`,
              kind: "rest",
              durationSeconds: restSeconds,
            }
          : null,
      );
    }
  }

  appendInterval(
    intervals,
    cooldownSeconds > 0
      ? {
          id: "cooldown",
          label: "Cooldown",
          kind: "cooldown",
          durationSeconds: cooldownSeconds,
        }
      : null,
  );

  return {
    name: `Circuit ${exercises} Moves x ${rounds} Rounds`,
    description: "Quick-created circuit timer.",
    isDraft: true,
    source: "scratch",
    intervals,
    totalSeconds: toTotalSeconds(intervals),
  };
}

function buildRoundInput(formData: FormData): TimerRecordInput {
  const roundSeconds = readPositiveInteger(formData, "roundSeconds", 180, {
    min: 15,
    max: 1_800,
  });
  const restSeconds = readPositiveInteger(formData, "restSeconds", 60, {
    min: 0,
    max: 900,
  });
  const rounds = readPositiveInteger(formData, "rounds", 5, {
    min: 1,
    max: 20,
  });
  const warmupSeconds = readPositiveInteger(formData, "warmupSeconds", 60, {
    min: 0,
    max: 900,
  });
  const cooldownSeconds = readPositiveInteger(formData, "cooldownSeconds", 60, {
    min: 0,
    max: 900,
  });
  const intervals: TimerIntervalBlock[] = [];

  appendInterval(
    intervals,
    warmupSeconds > 0
      ? {
          id: "warmup",
          label: "Warm up",
          kind: "warmup",
          durationSeconds: warmupSeconds,
        }
      : null,
  );

  for (let roundIndex = 1; roundIndex <= rounds; roundIndex += 1) {
    intervals.push({
      id: `round-${roundIndex}`,
      label: `Round ${roundIndex}`,
      kind: "work",
      durationSeconds: roundSeconds,
    });

    appendInterval(
      intervals,
      roundIndex < rounds && restSeconds > 0
        ? {
            id: `round-rest-${roundIndex}`,
            label: `Rest ${roundIndex}`,
            kind: "rest",
            durationSeconds: restSeconds,
          }
        : null,
    );
  }

  appendInterval(
    intervals,
    cooldownSeconds > 0
      ? {
          id: "cooldown",
          label: "Cooldown",
          kind: "cooldown",
          durationSeconds: cooldownSeconds,
        }
      : null,
  );

  return {
    name: `Round ${rounds} x ${formatSeconds(roundSeconds)}`,
    description: "Quick-created round timer.",
    isDraft: true,
    source: "scratch",
    intervals,
    totalSeconds: toTotalSeconds(intervals),
  };
}

export function buildTimerFromPreset(
  preset: CreatePresetKind,
  formData: FormData,
): TimerRecordInput {
  switch (preset) {
    case "hiit":
      return buildHiitInput(formData);
    case "circuit":
      return buildCircuitInput(formData);
    case "round":
      return buildRoundInput(formData);
    default:
      return buildHiitInput(formData);
  }
}

export function encodeGuestTimerSeed(input: TimerRecordInput) {
  return Buffer.from(JSON.stringify(input), "utf8").toString("base64url");
}

export function decodeGuestTimerSeed(seed: string | null | undefined) {
  if (!seed) {
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(seed, "base64url").toString("utf8"),
    ) as TimerRecordInput;
  } catch {
    return null;
  }
}

export async function createSignedInDraftFromInput(
  auth: SignedInAuthContext,
  input: TimerRecordInput,
): Promise<CreatedTimerResult> {
  if (isAuthTestMode()) {
    const row = insertMockPersonalTimerRow({ userId: auth.userId }, input);

    return {
      timerId: row.id,
      notice: `${input.name} created as a draft.`,
    };
  }

  if (!getNeonEnv()) {
    throw new Error("Signed-in timer creation requires auth test mode or database.");
  }

  const database = await createServer();
  const insert = buildPersonalTimerInsert({ userId: auth.userId }, input);
  const { data, error } = await database
    .from("personal_timers")
    .insert(insert)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("Unable to create timer draft.");
  }

  return {
    timerId: String(data.id),
    notice: `${input.name} created as a draft.`,
  };
}

