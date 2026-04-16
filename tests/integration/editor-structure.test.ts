import { describe, expect, it } from "vitest";

import {
  applyEditorAction,
  buildEditorStateFromTimer,
} from "../../src/features/editor/client/editor-state";
import { deriveTotalSeconds } from "../../src/features/editor/client/derive-total-seconds";

describe("editor-structure", () => {
  it("hydrates warmup and cooldown into editor structure", () => {
    const editorState = buildEditorStateFromTimer({
      name: "Structured Ladder",
      description: null,
      isDraft: true,
      source: "scratch",
      sourceTemplateId: null,
      intervals: [
        {
          id: "warmup",
          label: "Warm up",
          kind: "warmup",
          durationSeconds: 60,
        },
        {
          id: "work-1",
          label: "Push",
          kind: "work",
          durationSeconds: 45,
        },
        {
          id: "rest-1",
          label: "Reset",
          kind: "rest",
          durationSeconds: 15,
        },
        {
          id: "cooldown",
          label: "Cooldown",
          kind: "cooldown",
          durationSeconds: 60,
        },
      ],
    });

    expect(editorState.structure).toEqual({
      warmupSeconds: 60,
      cooldownSeconds: 60,
      rounds: 1,
      roundRestSeconds: 0,
    });
    expect(editorState.intervals.map((interval) => interval.id)).toEqual([
      "work-1",
      "rest-1",
    ]);
  });

  it("derives total duration from structure and repeated core intervals", () => {
    const baseState = buildEditorStateFromTimer({
      name: "Structured Ladder",
      description: null,
      isDraft: true,
      source: "scratch",
      sourceTemplateId: null,
      intervals: [
        {
          id: "work-1",
          label: "Push",
          kind: "work",
          durationSeconds: 45,
        },
        {
          id: "rest-1",
          label: "Reset",
          kind: "rest",
          durationSeconds: 15,
        },
      ],
    });
    const configuredState = applyEditorAction(baseState, {
      type: "update-structure",
      structure: {
        warmupSeconds: 60,
        cooldownSeconds: 60,
        rounds: 3,
        roundRestSeconds: 30,
      },
    });

    expect(deriveTotalSeconds(configuredState)).toBe(360);
  });
});
