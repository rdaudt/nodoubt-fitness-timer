"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import type { ProfileDisplayRecord } from "../../src/features/profiles/contracts/profile";
import {
  applyEditorAction,
  deriveEditorIntervalTotalSeconds,
  type EditorIntervalDraft,
  type EditorIntervalInput,
  type EditorState,
} from "../../src/features/editor/client/editor-state";
import { ProfileChip } from "../header/profile-chip";
import { IntervalForm } from "./interval-form";
import { IntervalList } from "./interval-list";

interface TimerEditorScreenProps {
  profile: ProfileDisplayRecord | null;
  authStatusLabel: "Guest" | "Signed In";
  initialState: EditorState;
  notice?: string | null;
  backHref: string;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function TimerEditorScreen({
  profile,
  authStatusLabel,
  initialState,
  notice,
  backHref,
}: TimerEditorScreenProps) {
  const [editorState, setEditorState] = useState(initialState);
  const [editingIntervalId, setEditingIntervalId] = useState<string | null>(null);
  const activeInterval = useMemo<EditorIntervalDraft | null>(
    () =>
      editorState.intervals.find((interval) => interval.id === editingIntervalId) ??
      null,
    [editingIntervalId, editorState.intervals],
  );
  const totalSeconds = useMemo(
    () => deriveEditorIntervalTotalSeconds(editorState),
    [editorState],
  );

  function applyIntervalUpdate(callback: () => void) {
    callback();
    setEditingIntervalId(null);
  }

  function handleSubmitInterval(interval: EditorIntervalInput) {
    if (editingIntervalId) {
      applyIntervalUpdate(() => {
        setEditorState((currentState) =>
          applyEditorAction(currentState, {
            type: "update-interval",
            intervalId: editingIntervalId,
            interval,
          }),
        );
      });
      return;
    }

    applyIntervalUpdate(() => {
      setEditorState((currentState) =>
        applyEditorAction(currentState, {
          type: "add-interval",
          interval,
        }),
      );
    });
  }

  return (
    <section
      data-testid="timer-editor-screen"
      style={{
        display: "grid",
        gap: "1.25rem",
      }}
    >
      <header
        style={{
          display: "grid",
          gap: "0.9rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "0.45rem",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#8c5c16",
              }}
            >
              Timer Editor
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "2rem",
                lineHeight: 1.05,
              }}
            >
              {editorState.name}
            </h1>
          </div>
          {profile ? <ProfileChip profile={profile} /> : null}
        </div>
        <div
          style={{
            display: "grid",
            gap: "0.7rem",
            padding: "1rem",
            borderRadius: "1.35rem",
            background:
              "linear-gradient(145deg, rgba(255, 248, 240, 0.96), rgba(245, 224, 196, 0.92))",
            border: "1px solid rgba(140, 92, 22, 0.14)",
          }}
        >
          <p
            data-testid="editor-auth-status"
            style={{
              display: "inline-flex",
              width: "fit-content",
              margin: 0,
              padding: "0.35rem 0.65rem",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              backgroundColor:
                authStatusLabel === "Signed In"
                  ? "rgba(27, 111, 92, 0.13)"
                  : "rgba(140, 92, 22, 0.12)",
              color: authStatusLabel === "Signed In" ? "#1b6f5c" : "#8c5c16",
            }}
          >
            {authStatusLabel}
          </p>
          <p
            style={{
              margin: 0,
              color: "#433d35",
            }}
          >
            Rearrange, duplicate, and refine the core interval sequence here. The
            next task layers structural timing and draft persistence onto this state.
          </p>
          {notice ? (
            <p
              data-testid="editor-notice"
              style={{
                margin: 0,
                padding: "0.8rem 0.9rem",
                borderRadius: "1rem",
                backgroundColor: "rgba(28, 24, 20, 0.9)",
                color: "#f8ecda",
                fontWeight: 600,
              }}
            >
              {notice}
            </p>
          ) : null}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <span
              data-testid="editor-total-duration"
              style={{
                borderRadius: "999px",
                padding: "0.35rem 0.6rem",
                backgroundColor: "rgba(255, 255, 255, 0.78)",
                color: "#433d35",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Total {formatDuration(totalSeconds)}
            </span>
            <span
              style={{
                borderRadius: "999px",
                padding: "0.35rem 0.6rem",
                backgroundColor: "rgba(255, 255, 255, 0.78)",
                color: "#433d35",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              {editorState.intervals.length} editable intervals
            </span>
          </div>
        </div>
      </header>
      <section
        style={{
          display: "grid",
          gap: "0.75rem",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.2rem",
          }}
        >
          Timer Basics
        </h2>
        <label
          style={{
            display: "grid",
            gap: "0.35rem",
            color: "#433d35",
            fontWeight: 600,
          }}
        >
          Timer name
          <input
            value={editorState.name}
            onChange={(event) =>
              setEditorState((currentState) =>
                applyEditorAction(currentState, {
                  type: "update-basics",
                  name: event.target.value,
                }),
              )
            }
            data-testid="editor-name-input"
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
        <label
          style={{
            display: "grid",
            gap: "0.35rem",
            color: "#433d35",
            fontWeight: 600,
          }}
        >
          Description
          <textarea
            value={editorState.description}
            onChange={(event) =>
              setEditorState((currentState) =>
                applyEditorAction(currentState, {
                  type: "update-basics",
                  description: event.target.value,
                }),
              )
            }
            rows={3}
            data-testid="editor-description-input"
            style={{
              borderRadius: "1rem",
              border: "1px solid rgba(140, 92, 22, 0.22)",
              padding: "0.8rem 0.9rem",
              fontSize: "1rem",
              color: "#2b2520",
              backgroundColor: "rgba(255, 255, 255, 0.88)",
              resize: "vertical",
            }}
          />
        </label>
      </section>
      <section
        style={{
          display: "grid",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.2rem",
            }}
          >
            Core Intervals
          </h2>
          <button
            type="button"
            onClick={() => setEditingIntervalId(null)}
            style={{
              border: "1px solid rgba(140, 92, 22, 0.18)",
              borderRadius: "999px",
              padding: "0.45rem 0.7rem",
              fontWeight: 700,
              backgroundColor: "rgba(255, 255, 255, 0.78)",
              color: "#1c1814",
            }}
          >
            Add Interval
          </button>
        </div>
        <IntervalList
          intervals={editorState.intervals}
          onEdit={setEditingIntervalId}
          onDuplicate={(intervalId) =>
            setEditorState((currentState) =>
              applyEditorAction(currentState, {
                type: "duplicate-interval",
                intervalId,
              }),
            )
          }
          onDelete={(intervalId) =>
            setEditorState((currentState) =>
              applyEditorAction(currentState, {
                type: "delete-interval",
                intervalId,
              }),
            )
          }
          onMove={(intervalId, direction) =>
            setEditorState((currentState) =>
              applyEditorAction(currentState, {
                type: "move-interval",
                intervalId,
                direction,
              }),
            )
          }
        />
      </section>
      <section
        style={{
          display: "grid",
          gap: "0.75rem",
          padding: "1rem",
          borderRadius: "1.2rem",
          backgroundColor: "rgba(255, 255, 255, 0.72)",
          border: "1px solid rgba(140, 92, 22, 0.12)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.2rem",
          }}
        >
          {activeInterval ? "Edit Interval" : "Add Interval"}
        </h2>
        <IntervalForm
          initialValue={activeInterval}
          submitLabel={activeInterval ? "Update Interval" : "Add Interval"}
          onSubmit={handleSubmitInterval}
          onCancel={activeInterval ? () => setEditingIntervalId(null) : undefined}
        />
      </section>
      <Link
        href={backHref}
        style={{
          width: "fit-content",
          color: "#6a635a",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Back to timer detail
      </Link>
    </section>
  );
}
