import {
  createServer,
  getNeonEnv,
  isAuthTestMode,
} from "../../../../lib/neon/server";
import type { SignedInAuthContext } from "../../auth/server/get-auth-context";
import type { TimerIntervalBlock } from "../../timers/contracts/timer-record";
import {
  mapPersonalTimerRow,
  updateMockPersonalTimerRow,
} from "../../timers/repositories/personal-timers";
import { deriveTotalSeconds } from "../client/derive-total-seconds";
import type { EditorState } from "../client/editor-state";

export interface SaveEditorDraftInput {
  timerId: string;
  editorState: EditorState;
}

export interface SaveEditorDraftResult {
  status: "saved";
  savedAt: string;
}

function buildIntervalsFromEditorState(editorState: EditorState): TimerIntervalBlock[] {
  const intervals: TimerIntervalBlock[] = [];

  if (editorState.structure.warmupSeconds > 0) {
    intervals.push({
      id: "warmup",
      label: "Warm up",
      kind: "warmup",
      durationSeconds: editorState.structure.warmupSeconds,
    });
  }

  for (let roundIndex = 1; roundIndex <= editorState.structure.rounds; roundIndex += 1) {
    for (const interval of editorState.intervals) {
      intervals.push({
        id: `${interval.id}-r${roundIndex}`,
        label:
          editorState.structure.rounds > 1
            ? `${interval.label} (Round ${roundIndex})`
            : interval.label,
        kind: interval.kind,
        durationSeconds: interval.durationSeconds,
      });
    }

    if (
      roundIndex < editorState.structure.rounds &&
      editorState.structure.roundRestSeconds > 0
    ) {
      intervals.push({
        id: `round-rest-${roundIndex}`,
        label: `Round ${roundIndex} Rest`,
        kind: "rest",
        durationSeconds: editorState.structure.roundRestSeconds,
      });
    }
  }

  if (editorState.structure.cooldownSeconds > 0) {
    intervals.push({
      id: "cooldown",
      label: "Cooldown",
      kind: "cooldown",
      durationSeconds: editorState.structure.cooldownSeconds,
    });
  }

  return intervals;
}

export async function saveEditorDraft(
  auth: SignedInAuthContext,
  input: SaveEditorDraftInput,
): Promise<SaveEditorDraftResult> {
  const timerId = input.timerId.trim();

  if (!timerId) {
    throw new Error("Timer id is required for draft saves.");
  }

  const name = input.editorState.name.trim();
  const description = input.editorState.description.trim();
  const totalSeconds = deriveTotalSeconds(input.editorState);
  const intervals = buildIntervalsFromEditorState(input.editorState);

  if (isAuthTestMode()) {
    const updated = updateMockPersonalTimerRow(
      { userId: auth.userId },
      timerId,
      {
        name: name || "Untitled Timer",
        description: description || null,
        isDraft: true,
        intervals,
        totalSeconds,
      },
    );

    if (!updated) {
      throw new Error("Timer draft save failed in auth test mode.");
    }

    const record = mapPersonalTimerRow(updated);

    return {
      status: "saved",
      savedAt: record.updatedAt,
    };
  }

  if (!getNeonEnv()) {
    throw new Error("Draft saving requires auth test mode or database configuration.");
  }

  const database = await createServer();
  const payload = {
    name: name || "Untitled Timer",
    description: description || null,
    is_draft: true,
    intervals,
    total_seconds: totalSeconds,
  };
  const { data, error } = await database
    .from("personal_timers")
    .update(payload)
    .eq("id", timerId)
    .eq("owner_id", auth.userId)
    .select("updated_at")
    .single();

  if (error || !data) {
    throw new Error("Timer draft save failed.");
  }

  return {
    status: "saved",
    savedAt: String(data.updated_at),
  };
}

