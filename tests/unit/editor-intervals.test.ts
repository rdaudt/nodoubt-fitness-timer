import { describe, expect, it } from "vitest";

import {
  applyEditorAction,
  buildEditorStateFromTimer,
} from "../../src/features/editor/client/editor-state";

describe("editor-intervals", () => {
  it("builds editable state from work and rest intervals only", () => {
    const editorState = buildEditorStateFromTimer({
      name: "Sprint Ladder",
      description: "Track efforts",
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
          label: "Sprint",
          kind: "work",
          durationSeconds: 30,
        },
        {
          id: "rest-1",
          label: "Walk",
          kind: "rest",
          durationSeconds: 30,
        },
        {
          id: "cooldown",
          label: "Cooldown",
          kind: "cooldown",
          durationSeconds: 60,
        },
      ],
    });

    expect(editorState.intervals.map((interval) => interval.id)).toEqual([
      "work-1",
      "rest-1",
    ]);
  });

  it("supports add, edit, duplicate, reorder, and delete transitions", () => {
    const initialState = buildEditorStateFromTimer({
      name: "Tempo Builder",
      description: null,
      isDraft: true,
      source: "scratch",
      sourceTemplateId: null,
      intervals: [
        {
          id: "work-1",
          label: "Tempo",
          kind: "work",
          durationSeconds: 45,
        },
      ],
    });

    const withAddedInterval = applyEditorAction(initialState, {
      type: "add-interval",
      interval: {
        label: "Reset",
        kind: "rest",
        durationSeconds: 15,
      },
    });
    const addedIntervalId = withAddedInterval.intervals[1]?.id ?? "";
    const withEditedInterval = applyEditorAction(withAddedInterval, {
      type: "update-interval",
      intervalId: addedIntervalId,
      interval: {
        label: "Full Reset",
        kind: "rest",
        durationSeconds: 20,
      },
    });
    const withDuplicate = applyEditorAction(withEditedInterval, {
      type: "duplicate-interval",
      intervalId: "work-1",
    });
    const withMovedInterval = applyEditorAction(withDuplicate, {
      type: "move-interval",
      intervalId: addedIntervalId,
      direction: "up",
    });
    const duplicatedIntervalId =
      withMovedInterval.intervals.find((interval) => interval.label === "Tempo Copy")
        ?.id ?? "";
    const withDeletedInterval = applyEditorAction(withMovedInterval, {
      type: "delete-interval",
      intervalId: duplicatedIntervalId,
    });

    expect(withEditedInterval.intervals[1]).toMatchObject({
      id: addedIntervalId,
      label: "Full Reset",
      kind: "rest",
      durationSeconds: 20,
    });
    expect(withDuplicate.intervals).toHaveLength(3);
    expect(withMovedInterval.intervals.map((interval) => interval.label)).toEqual([
      "Tempo",
      "Full Reset",
      "Tempo Copy",
    ]);
    expect(withDeletedInterval.intervals.map((interval) => interval.label)).toEqual([
      "Tempo",
      "Full Reset",
    ]);
  });
});
