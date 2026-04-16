"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { ProfileDisplayRecord } from "../../src/features/profiles/contracts/profile";
import type { TimerRecordInput } from "../../src/features/timers/contracts/timer-record";
import {
  clearGuestTempTimer,
  hasGuestTempTimer,
  readGuestTempTimer,
  writeGuestTempTimer,
  type GuestTempTimerDraft,
} from "../../src/features/guest-temp/client/temp-timer-store";
import { ProfileChip } from "../header/profile-chip";
import { SavePromptModal } from "../auth/save-prompt-modal";

interface CustomCreateEditorProps {
  profile: ProfileDisplayRecord | null;
  initialDraft: GuestTempTimerDraft;
  notice: string | null;
  useSeededDraft: boolean;
}

type PromptMode = "save" | "leave" | null;

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function CustomCreateEditor({
  profile,
  initialDraft,
  notice,
  useSeededDraft,
}: CustomCreateEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<GuestTempTimerDraft>(initialDraft);
  const [promptMode, setPromptMode] = useState<PromptMode>(null);

  useEffect(() => {
    if (useSeededDraft) {
      const persistedSeededDraft = writeGuestTempTimer(initialDraft);
      setDraft(persistedSeededDraft);
      return;
    }

    const storedDraft = readGuestTempTimer();

    if (storedDraft) {
      setDraft(storedDraft);
      return;
    }

    const persistedDraft = writeGuestTempTimer(initialDraft);
    setDraft(persistedDraft);
  }, [initialDraft, useSeededDraft]);

  const hasTemporaryWork = useMemo(() => hasGuestTempTimer(), [draft]);
  const metaItems = useMemo(
    () => [
      "Temporary guest draft",
      `${draft.timer.intervals.length} intervals`,
      formatDuration(draft.timer.totalSeconds),
    ],
    [draft],
  );

  function closePrompt() {
    setPromptMode(null);
  }

  function discardAndLeave() {
    clearGuestTempTimer();
    setPromptMode(null);
    router.push("/create");
  }

  return (
    <>
      <section
        data-testid="custom-create-editor"
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
                Custom Timer
              </p>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  lineHeight: 1.05,
                }}
              >
                {draft.timer.name}
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
              data-testid="guest-temp-status"
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
                backgroundColor: "rgba(140, 92, 22, 0.12)",
                color: "#8c5c16",
              }}
            >
              {hasTemporaryWork ? "Guest Temporary Draft" : "Guest Draft Ready"}
            </p>
            <p
              style={{
                margin: 0,
                color: "#433d35",
              }}
            >
              {draft.timer.description}
            </p>
            {notice ? (
              <p
                data-testid="custom-create-notice"
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
              {metaItems.map((item) => (
                <span
                  key={item}
                  style={{
                    borderRadius: "999px",
                    padding: "0.35rem 0.6rem",
                    backgroundColor: "rgba(255, 255, 255, 0.78)",
                    color: "#433d35",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </header>
        <section
          style={{
            display: "grid",
            gap: "0.8rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.15rem",
            }}
          >
            Interval Structure
          </h2>
          <div
            style={{
              display: "grid",
              gap: "0.7rem",
            }}
          >
            {draft.timer.intervals.map((interval, index) => (
              <article
                key={interval.id}
                data-testid={`custom-interval-${interval.id}`}
                style={{
                  display: "grid",
                  gap: "0.35rem",
                  borderRadius: "1.2rem",
                  padding: "0.95rem",
                  backgroundColor: "#fff8f0",
                  border: "1px solid rgba(140, 92, 22, 0.14)",
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
              </article>
            ))}
          </div>
        </section>
        <section
          style={{
            display: "grid",
            gap: "0.75rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.15rem",
            }}
          >
            Guest Save Boundary
          </h2>
          <p
            style={{
              margin: 0,
              color: "#5a544d",
            }}
          >
            Guest timers stay local to this browser session. Sign in before saving
            permanently or leaving with work you want to keep.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "0.75rem",
            }}
          >
            <button
              type="button"
              data-testid="guest-save-permanent"
              onClick={() => setPromptMode("save")}
              style={{
                border: "none",
                borderRadius: "1rem",
                padding: "0.9rem 1rem",
                fontWeight: 700,
                backgroundColor: "#f2bb67",
                color: "#1c1814",
              }}
            >
              Save Permanently
            </button>
            <button
              type="button"
              data-testid="guest-leave-create"
              onClick={() => setPromptMode("leave")}
              style={{
                border: "1px solid rgba(140, 92, 22, 0.18)",
                borderRadius: "1rem",
                padding: "0.9rem 1rem",
                fontWeight: 700,
                backgroundColor: "rgba(255, 255, 255, 0.78)",
                color: "#1c1814",
              }}
            >
              Leave Create Flow
            </button>
          </div>
          <Link
            href="/create"
            style={{
              width: "fit-content",
              color: "#6a635a",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Back to timer types
          </Link>
        </section>
      </section>
      <SavePromptModal
        open={promptMode === "save"}
        title="Sign in to save this timer"
        description="Guest timers stay temporary. Move through sign-in before saving permanently to your library."
        onClose={closePrompt}
      >
        <Link
          href="/"
          data-testid="save-prompt-sign-in"
          style={{
            display: "inline-flex",
            justifyContent: "center",
            borderRadius: "1rem",
            padding: "0.85rem 0.95rem",
            textDecoration: "none",
            fontWeight: 700,
            backgroundColor: "#f2bb67",
            color: "#1c1814",
          }}
        >
          Go to Home Sign-In
        </Link>
        <button
          type="button"
          onClick={closePrompt}
          data-testid="save-prompt-keep-editing"
          style={{
            border: "1px solid rgba(140, 92, 22, 0.18)",
            borderRadius: "1rem",
            padding: "0.85rem 0.95rem",
            fontWeight: 700,
            backgroundColor: "rgba(255, 255, 255, 0.78)",
            color: "#1c1814",
          }}
        >
          Keep Editing
        </button>
      </SavePromptModal>
      <SavePromptModal
        open={promptMode === "leave"}
        title="Save before you lose this temporary timer"
        description="Leaving now drops you back to the create picker. Sign in to keep this workout or discard it and continue."
        onClose={closePrompt}
      >
        <Link
          href="/"
          data-testid="leave-prompt-sign-in"
          style={{
            display: "inline-flex",
            justifyContent: "center",
            borderRadius: "1rem",
            padding: "0.85rem 0.95rem",
            textDecoration: "none",
            fontWeight: 700,
            backgroundColor: "#f2bb67",
            color: "#1c1814",
          }}
        >
          Sign In Before Leaving
        </Link>
        <button
          type="button"
          onClick={discardAndLeave}
          data-testid="leave-prompt-discard"
          style={{
            border: "none",
            borderRadius: "1rem",
            padding: "0.85rem 0.95rem",
            fontWeight: 700,
            backgroundColor: "#c24d36",
            color: "#fff4ee",
          }}
        >
          Discard Temporary Timer
        </button>
        <button
          type="button"
          onClick={closePrompt}
          data-testid="leave-prompt-keep-editing"
          style={{
            border: "1px solid rgba(140, 92, 22, 0.18)",
            borderRadius: "1rem",
            padding: "0.85rem 0.95rem",
            fontWeight: 700,
            backgroundColor: "rgba(255, 255, 255, 0.78)",
            color: "#1c1814",
          }}
        >
          Keep Editing
        </button>
      </SavePromptModal>
    </>
  );
}
