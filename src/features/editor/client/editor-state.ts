import type {
  TimerIntervalBlock,
  TimerRecord,
  TimerRecordInput,
} from "../../timers/contracts/timer-record";

export type EditorIntervalKind = Extract<TimerIntervalBlock["kind"], "work" | "rest">;

export interface EditorIntervalDraft {
  id: string;
  label: string;
  kind: EditorIntervalKind;
  durationSeconds: number;
}

export interface EditorState {
  name: string;
  description: string;
  isDraft: boolean;
  source: TimerRecord["source"];
  sourceTemplateId: string | null;
  intervals: EditorIntervalDraft[];
}

export interface EditorIntervalInput {
  label: string;
  kind: EditorIntervalKind;
  durationSeconds: number;
}

export type EditorAction =
  | { type: "update-basics"; name?: string; description?: string }
  | { type: "add-interval"; interval: EditorIntervalInput }
  | { type: "update-interval"; intervalId: string; interval: EditorIntervalInput }
  | { type: "delete-interval"; intervalId: string }
  | { type: "duplicate-interval"; intervalId: string }
  | { type: "move-interval"; intervalId: string; direction: "up" | "down" };

function clampDurationSeconds(durationSeconds: number) {
  if (!Number.isFinite(durationSeconds)) {
    return 30;
  }

  return Math.min(Math.max(Math.round(durationSeconds), 5), 3_600);
}

function normalizeLabel(label: string, kind: EditorIntervalKind) {
  const trimmedLabel = label.trim();

  if (trimmedLabel) {
    return trimmedLabel;
  }

  return kind === "rest" ? "Rest" : "Work";
}

function createIntervalId() {
  return `editor-interval-${crypto.randomUUID()}`;
}

function buildIntervalDraft(input: EditorIntervalInput): EditorIntervalDraft {
  return {
    id: createIntervalId(),
    label: normalizeLabel(input.label, input.kind),
    kind: input.kind,
    durationSeconds: clampDurationSeconds(input.durationSeconds),
  };
}

function toEditorInterval(interval: TimerIntervalBlock): EditorIntervalDraft | null {
  if (interval.kind !== "work" && interval.kind !== "rest") {
    return null;
  }

  return {
    id: interval.id,
    label: interval.label,
    kind: interval.kind,
    durationSeconds: clampDurationSeconds(interval.durationSeconds),
  };
}

function buildFallbackInterval(): EditorIntervalDraft {
  return {
    id: "editor-interval-default",
    label: "Main effort",
    kind: "work",
    durationSeconds: 45,
  };
}

export function deriveEditorIntervalTotalSeconds(state: Pick<EditorState, "intervals">) {
  return state.intervals.reduce(
    (sum, interval) => sum + interval.durationSeconds,
    0,
  );
}

export function buildEditorStateFromTimer(
  timer: Pick<
    TimerRecord | TimerRecordInput,
    "name" | "description" | "isDraft" | "source" | "sourceTemplateId" | "intervals"
  >,
): EditorState {
  const coreIntervals = timer.intervals
    .map((interval) => toEditorInterval(interval))
    .filter((interval): interval is EditorIntervalDraft => interval !== null);

  return {
    name: timer.name,
    description: timer.description ?? "",
    isDraft: timer.isDraft ?? true,
    source: timer.source ?? "scratch",
    sourceTemplateId: timer.sourceTemplateId ?? null,
    intervals: coreIntervals.length > 0 ? coreIntervals : [buildFallbackInterval()],
  };
}

export function applyEditorAction(
  state: EditorState,
  action: EditorAction,
): EditorState {
  switch (action.type) {
    case "update-basics":
      return {
        ...state,
        name: action.name ?? state.name,
        description: action.description ?? state.description,
      };
    case "add-interval":
      return {
        ...state,
        intervals: [...state.intervals, buildIntervalDraft(action.interval)],
      };
    case "update-interval":
      return {
        ...state,
        intervals: state.intervals.map((interval) => {
          if (interval.id !== action.intervalId) {
            return interval;
          }

          return {
            ...interval,
            label: normalizeLabel(action.interval.label, action.interval.kind),
            kind: action.interval.kind,
            durationSeconds: clampDurationSeconds(action.interval.durationSeconds),
          };
        }),
      };
    case "delete-interval": {
      const remainingIntervals = state.intervals.filter(
        (interval) => interval.id !== action.intervalId,
      );

      return {
        ...state,
        intervals:
          remainingIntervals.length > 0
            ? remainingIntervals
            : [buildFallbackInterval()],
      };
    }
    case "duplicate-interval": {
      const nextIntervals: EditorIntervalDraft[] = [];

      for (const interval of state.intervals) {
        nextIntervals.push(interval);

        if (interval.id === action.intervalId) {
          nextIntervals.push({
            ...interval,
            id: createIntervalId(),
            label: `${interval.label} Copy`,
          });
        }
      }

      return {
        ...state,
        intervals: nextIntervals,
      };
    }
    case "move-interval": {
      const currentIndex = state.intervals.findIndex(
        (interval) => interval.id === action.intervalId,
      );

      if (currentIndex < 0) {
        return state;
      }

      const nextIndex =
        action.direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (nextIndex < 0 || nextIndex >= state.intervals.length) {
        return state;
      }

      const nextIntervals = [...state.intervals];
      const [movedInterval] = nextIntervals.splice(currentIndex, 1);

      nextIntervals.splice(nextIndex, 0, movedInterval);

      return {
        ...state,
        intervals: nextIntervals,
      };
    }
    default:
      return state;
  }
}
