import type {
  CompileRunSequenceInput,
  RunSequence,
  RunSequenceInterval,
} from "../contracts/run-sequence";

const MS_PER_SECOND = 1_000;
const DEFAULT_PREP_SECONDS = 5;

function toDurationMs(seconds: number) {
  return Math.max(0, Math.round(seconds * MS_PER_SECOND));
}

function normalizePrepSeconds(value: number | undefined) {
  if (value === undefined) {
    return DEFAULT_PREP_SECONDS;
  }

  return Math.max(0, Math.floor(value));
}

function buildSequenceId(input: CompileRunSequenceInput) {
  return `${input.sourceKind}:${input.sourceRef}:v${input.definitionVersion ?? 1}`;
}

function buildIntervals(input: CompileRunSequenceInput): RunSequenceInterval[] {
  let cursor = 0;
  const total = input.intervals.length;

  return input.intervals.map((interval, index) => {
    const durationMs = toDurationMs(interval.durationSeconds);
    const startMs = cursor;
    const endMs = startMs + durationMs;

    cursor = endMs;

    return {
      id: interval.id,
      label: interval.label,
      kind: interval.kind,
      durationMs,
      startMs,
      endMs,
      index,
      total,
    };
  });
}

export function compileRunSequence(input: CompileRunSequenceInput): RunSequence {
  const prepDurationMs = toDurationMs(normalizePrepSeconds(input.prepSeconds));
  const intervals = buildIntervals(input);
  const activeDurationMs = intervals.at(-1)?.endMs ?? 0;

  return {
    id: buildSequenceId(input),
    title: input.title.trim() || "Workout",
    sourceKind: input.sourceKind,
    sourceRef: input.sourceRef,
    definitionVersion: input.definitionVersion ?? 1,
    prepDurationMs,
    activeDurationMs,
    totalDurationMs: prepDurationMs + activeDurationMs,
    intervals,
  };
}