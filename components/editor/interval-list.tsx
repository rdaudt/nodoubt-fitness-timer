import type { EditorIntervalDraft } from "../../src/features/editor/client/editor-state";

interface IntervalListProps {
  intervals: EditorIntervalDraft[];
  onEdit: (intervalId: string) => void;
  onDuplicate: (intervalId: string) => void;
  onDelete: (intervalId: string) => void;
  onMove: (intervalId: string, direction: "up" | "down") => void;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (!minutes) {
    return `${seconds}s`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function IntervalList({
  intervals,
  onEdit,
  onDuplicate,
  onDelete,
  onMove,
}: IntervalListProps) {
  return (
    <div
      style={{
        display: "grid",
        gap: "0.7rem",
      }}
    >
      {intervals.map((interval, index) => (
        <article
          key={interval.id}
          data-testid={`editor-interval-${interval.id}`}
          style={{
            display: "grid",
            gap: "0.7rem",
            borderRadius: "1.2rem",
            padding: "0.95rem",
            backgroundColor: "#fff8f0",
            border: "1px solid rgba(140, 92, 22, 0.14)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: "0.35rem",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#8c5c16",
                }}
              >
                Interval {index + 1}
              </p>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                }}
              >
                {interval.label}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#4b453d",
                }}
              >
                {interval.kind} | {formatDuration(interval.durationSeconds)}
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gap: "0.45rem",
              }}
            >
              <button
                type="button"
                data-testid={`editor-move-up-${interval.id}`}
                disabled={index === 0}
                onClick={() => onMove(interval.id, "up")}
                style={{
                  border: "1px solid rgba(140, 92, 22, 0.18)",
                  borderRadius: "999px",
                  padding: "0.35rem 0.6rem",
                  fontWeight: 700,
                  backgroundColor: "rgba(255, 255, 255, 0.78)",
                  color: "#1c1814",
                }}
              >
                Up
              </button>
              <button
                type="button"
                data-testid={`editor-move-down-${interval.id}`}
                disabled={index === intervals.length - 1}
                onClick={() => onMove(interval.id, "down")}
                style={{
                  border: "1px solid rgba(140, 92, 22, 0.18)",
                  borderRadius: "999px",
                  padding: "0.35rem 0.6rem",
                  fontWeight: 700,
                  backgroundColor: "rgba(255, 255, 255, 0.78)",
                  color: "#1c1814",
                }}
              >
                Down
              </button>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "0.6rem",
            }}
          >
            <button
              type="button"
              data-testid={`editor-edit-${interval.id}`}
              onClick={() => onEdit(interval.id)}
              style={{
                border: "1px solid rgba(140, 92, 22, 0.18)",
                borderRadius: "1rem",
                padding: "0.75rem 0.85rem",
                fontWeight: 700,
                backgroundColor: "rgba(255, 255, 255, 0.78)",
                color: "#1c1814",
              }}
            >
              Edit
            </button>
            <button
              type="button"
              data-testid={`editor-duplicate-${interval.id}`}
              onClick={() => onDuplicate(interval.id)}
              style={{
                border: "none",
                borderRadius: "1rem",
                padding: "0.75rem 0.85rem",
                fontWeight: 700,
                backgroundColor: "#f2bb67",
                color: "#1c1814",
              }}
            >
              Duplicate
            </button>
            <button
              type="button"
              data-testid={`editor-delete-${interval.id}`}
              onClick={() => onDelete(interval.id)}
              style={{
                border: "none",
                borderRadius: "1rem",
                padding: "0.75rem 0.85rem",
                fontWeight: 700,
                backgroundColor: "#c24d36",
                color: "#fff4ee",
              }}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
