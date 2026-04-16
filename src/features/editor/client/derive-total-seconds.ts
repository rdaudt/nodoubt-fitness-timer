import type { EditorState } from "./editor-state";

export function deriveTotalSeconds(state: Pick<EditorState, "intervals" | "structure">) {
  const coreTotalSeconds = state.intervals.reduce(
    (sum, interval) => sum + interval.durationSeconds,
    0,
  );

  return (
    state.structure.warmupSeconds +
    state.structure.cooldownSeconds +
    coreTotalSeconds * state.structure.rounds +
    state.structure.roundRestSeconds * Math.max(state.structure.rounds - 1, 0)
  );
}
