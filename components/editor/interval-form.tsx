"use client";

import { useEffect, useState } from "react";

import type {
  EditorIntervalDraft,
  EditorIntervalInput,
} from "../../src/features/editor/client/editor-state";

interface IntervalFormProps {
  initialValue?: EditorIntervalDraft | null;
  submitLabel: string;
  onSubmit: (interval: EditorIntervalInput) => void;
  onCancel?: () => void;
}

function clampDurationSeconds(rawValue: string) {
  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(parsedValue)) {
    return 30;
  }

  return Math.min(Math.max(parsedValue, 5), 3_600);
}

export function IntervalForm({
  initialValue,
  submitLabel,
  onSubmit,
  onCancel,
}: IntervalFormProps) {
  const [label, setLabel] = useState(initialValue?.label ?? "");
  const [kind, setKind] = useState<EditorIntervalInput["kind"]>(
    initialValue?.kind ?? "work",
  );
  const [durationSeconds, setDurationSeconds] = useState(
    String(initialValue?.durationSeconds ?? 45),
  );

  useEffect(() => {
    setLabel(initialValue?.label ?? "");
    setKind(initialValue?.kind ?? "work");
    setDurationSeconds(String(initialValue?.durationSeconds ?? 45));
  }, [initialValue]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          label,
          kind,
          durationSeconds: clampDurationSeconds(durationSeconds),
        });
      }}
      style={{
        display: "grid",
        gap: "0.75rem",
      }}
    >
      <label
        style={{
          display: "grid",
          gap: "0.35rem",
          color: "#433d35",
          fontWeight: 600,
        }}
      >
        Interval label
        <input
          name="label"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          data-testid="editor-interval-label-input"
          style={{
            borderRadius: "1rem",
            border: "1px solid rgba(140, 92, 22, 0.22)",
            padding: "0.8rem 0.9rem",
            fontSize: "1rem",
            color: "#2b2520",
            backgroundColor: "rgba(255, 255, 255, 0.88)",
          }}
        />
      </label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "0.75rem",
        }}
      >
        <label
          style={{
            display: "grid",
            gap: "0.35rem",
            color: "#433d35",
            fontWeight: 600,
          }}
        >
          Kind
          <select
            name="kind"
            value={kind}
            onChange={(event) =>
              setKind(event.target.value as EditorIntervalInput["kind"])
            }
            data-testid="editor-interval-kind-input"
            style={{
              borderRadius: "1rem",
              border: "1px solid rgba(140, 92, 22, 0.22)",
              padding: "0.8rem 0.9rem",
              fontSize: "1rem",
              color: "#2b2520",
              backgroundColor: "rgba(255, 255, 255, 0.88)",
            }}
          >
            <option value="work">Work</option>
            <option value="rest">Rest</option>
          </select>
        </label>
        <label
          style={{
            display: "grid",
            gap: "0.35rem",
            color: "#433d35",
            fontWeight: 600,
          }}
        >
          Duration (seconds)
          <input
            name="durationSeconds"
            type="number"
            min={5}
            max={3600}
            step={5}
            value={durationSeconds}
            onChange={(event) => setDurationSeconds(event.target.value)}
            data-testid="editor-interval-duration-input"
            style={{
              borderRadius: "1rem",
              border: "1px solid rgba(140, 92, 22, 0.22)",
              padding: "0.8rem 0.9rem",
              fontSize: "1rem",
              color: "#2b2520",
              backgroundColor: "rgba(255, 255, 255, 0.88)",
            }}
          />
        </label>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.65rem",
        }}
      >
        <button
          type="submit"
          data-testid="editor-interval-submit"
          style={{
            border: "none",
            borderRadius: "1rem",
            padding: "0.85rem 0.95rem",
            fontWeight: 700,
            backgroundColor: "#f2bb67",
            color: "#1c1814",
          }}
        >
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            style={{
              border: "1px solid rgba(140, 92, 22, 0.18)",
              borderRadius: "1rem",
              padding: "0.85rem 0.95rem",
              fontWeight: 700,
              backgroundColor: "rgba(255, 255, 255, 0.78)",
              color: "#1c1814",
            }}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
