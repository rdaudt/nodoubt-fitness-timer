"use client";

import { useEffect, useMemo, useState } from "react";

import type { RunSessionSnapshot } from "../../src/features/run/contracts/run-session";
import type { RunSequence } from "../../src/features/run/contracts/run-sequence";
import {
  clearRunSessionSnapshot,
  readRunSessionSnapshot,
  writeRunSessionSnapshot,
} from "../../src/features/run/client/run-session-store";
import { useRunEngine } from "../../src/features/run/client/use-run-engine";
import { RunControls } from "./run-controls";

const ACTIVE_RUN_COOKIE_NAME = "ndft-active-run";

export interface RunScreenProps {
  sequence: RunSequence;
  notice: string | null;
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.ceil(Math.max(0, durationMs) / 1_000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) {
    return `${seconds}s`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function writeActiveRunCookie(sequence: RunSequence, session: RunSessionSnapshot) {
  if (typeof document === "undefined") {
    return;
  }

  if (sequence.sourceKind !== "personal-timer") {
    document.cookie = `${ACTIVE_RUN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }

  const marker = encodeURIComponent(
    JSON.stringify({
      timerId: sequence.sourceRef,
      sessionId: session.sessionId,
      status: session.status,
    }),
  );

  document.cookie = `${ACTIVE_RUN_COOKIE_NAME}=${marker}; Path=/; SameSite=Lax`;
}

function clearActiveRunCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${ACTIVE_RUN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function RunScreen({ sequence, notice }: RunScreenProps) {
  const [initialSession, setInitialSession] = useState<RunSessionSnapshot | null>(
    null,
  );
  const [sessionReady, setSessionReady] = useState(false);
  const [controlsLocked, setControlsLocked] = useState(false);
  const [resetConfirming, setResetConfirming] = useState(false);
  const [runInactive, setRunInactive] = useState(false);

  useEffect(() => {
    const restoredSession = readRunSessionSnapshot();

    if (
      restoredSession &&
      restoredSession.sequenceId === sequence.id &&
      restoredSession.sourceKind === sequence.sourceKind &&
      restoredSession.sourceRef === sequence.sourceRef
    ) {
      setInitialSession(restoredSession);
      setRunInactive(restoredSession.status === "completed");
    } else {
      clearRunSessionSnapshot();
      clearActiveRunCookie();
      setInitialSession(null);
      setRunInactive(false);
    }

    setSessionReady(true);
  }, [sequence.id, sequence.sourceKind, sequence.sourceRef]);

  const engine = useRunEngine(sequence, {
    initialSession,
  });

  useEffect(() => {
    if (!sessionReady) {
      return;
    }

    if (engine.session.status === "completed") {
      clearRunSessionSnapshot();
      clearActiveRunCookie();
      return;
    }

    writeRunSessionSnapshot(engine.session);

    if (runInactive) {
      clearActiveRunCookie();
      return;
    }

    writeActiveRunCookie(sequence, engine.session);
  }, [engine.session, runInactive, sequence, sessionReady]);

  useEffect(() => {
    if (engine.frame.state === "completed") {
      setControlsLocked(false);
      setResetConfirming(false);
    }
  }, [engine.frame.state]);

  const progressLabel = useMemo(() => {
    if (!engine.frame.currentInterval) {
      return "Get ready";
    }

    return `Interval ${engine.frame.currentInterval.index + 1} of ${sequence.intervals.length}`;
  }, [engine.frame.currentInterval, sequence.intervals.length]);

  const handlePauseResume = () => {
    if (engine.session.status === "running") {
      engine.pause();
      return;
    }

    setRunInactive(false);
    engine.resume();
  };

  const handleResetConfirm = () => {
    setResetConfirming(false);
    setRunInactive(true);
    engine.reset();
    engine.pause();
    clearRunSessionSnapshot();
    clearActiveRunCookie();
  };

  return (
    <section
      data-testid="run-screen"
      style={{
        minHeight: "100vh",
        display: "grid",
        alignContent: "center",
        gap: "1rem",
        padding: "1.1rem",
        maxWidth: "34rem",
        margin: "0 auto",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.72rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#f4b862",
          fontWeight: 700,
        }}
      >
        {sequence.sourceKind.replace("-", " ")}
      </p>
      <h1
        data-testid="run-title"
        style={{
          margin: 0,
          fontSize: "2rem",
          lineHeight: 1.02,
        }}
      >
        {sequence.title}
      </h1>
      {notice ? (
        <p
          data-testid="run-notice"
          style={{
            margin: 0,
            borderRadius: "0.9rem",
            padding: "0.65rem 0.75rem",
            backgroundColor: "rgba(255, 244, 238, 0.11)",
            color: "#fff3e6",
            fontWeight: 600,
          }}
        >
          {notice}
        </p>
      ) : null}
      <div
        style={{
          display: "grid",
          gap: "0.5rem",
          borderRadius: "1.15rem",
          padding: "1rem",
          background: "linear-gradient(160deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.04))",
          border: "1px solid rgba(255, 255, 255, 0.16)",
        }}
      >
        <p
          data-testid="run-progress-label"
          style={{
            margin: 0,
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255, 247, 237, 0.75)",
            fontWeight: 700,
          }}
        >
          {progressLabel}
        </p>
        <p
          data-testid="run-current-interval"
          style={{
            margin: 0,
            fontSize: "1.85rem",
            lineHeight: 1.08,
            fontWeight: 700,
          }}
        >
          {engine.frame.currentInterval
            ? engine.frame.currentInterval.label
            : engine.frame.state === "prep"
              ? "Get ready"
              : "Workout complete"}
        </p>
        <p
          data-testid="run-next-interval"
          style={{
            margin: 0,
            color: "rgba(255, 247, 237, 0.8)",
            fontWeight: 600,
          }}
        >
          {engine.frame.nextInterval
            ? `Next: ${engine.frame.nextInterval.label}`
            : "Next: Finish"}
        </p>
        <p
          data-testid="run-total-remaining"
          style={{
            margin: 0,
            fontSize: "3rem",
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {formatDuration(engine.frame.totalRemainingMs)}
        </p>
      </div>
      <RunControls
        isRunning={engine.session.status === "running"}
        controlsLocked={controlsLocked}
        resetConfirming={resetConfirming}
        canJumpPrevious={engine.frame.elapsedMs > 0}
        canJumpNext={engine.frame.totalRemainingMs > 0}
        onPauseResume={handlePauseResume}
        onPrevious={() => {
          setRunInactive(false);
          engine.previous();
        }}
        onNext={() => {
          setRunInactive(false);
          engine.next();
        }}
        onResetRequest={() => setResetConfirming(true)}
        onResetCancel={() => setResetConfirming(false)}
        onResetConfirm={handleResetConfirm}
        onToggleLock={() => {
          setResetConfirming(false);
          setControlsLocked((current) => !current);
        }}
      />
    </section>
  );
}
