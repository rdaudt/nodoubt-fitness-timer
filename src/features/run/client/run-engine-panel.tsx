"use client";

import { useEffect, useState } from "react";

import type { RunSessionSnapshot } from "../contracts/run-session";
import type { RunSequence } from "../contracts/run-sequence";
import {
  clearRunSessionSnapshot,
  readRunSessionSnapshot,
  writeRunSessionSnapshot,
} from "./run-session-store";
import { useRunEngine } from "./use-run-engine";

function formatDuration(durationMs: number) {
  const totalSeconds = Math.ceil(Math.max(0, durationMs) / 1_000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) {
    return `${seconds}s`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export interface RunEnginePanelProps {
  sequence: RunSequence;
  notice: string | null;
}

export function RunEnginePanel({ sequence, notice }: RunEnginePanelProps) {
  const [initialSession, setInitialSession] = useState<RunSessionSnapshot | null>(
    null,
  );
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const restoredSession = readRunSessionSnapshot();

    if (
      restoredSession &&
      restoredSession.sequenceId === sequence.id &&
      restoredSession.sourceKind === sequence.sourceKind &&
      restoredSession.sourceRef === sequence.sourceRef
    ) {
      setInitialSession(restoredSession);
    } else {
      clearRunSessionSnapshot();
      setInitialSession(null);
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
      return;
    }

    writeRunSessionSnapshot(engine.session);
  }, [engine.session, sessionReady]);

  return (
    <section
      data-testid="run-screen"
      style={{
        minHeight: "calc(100vh - 3rem)",
        borderRadius: "2rem",
        background:
          "linear-gradient(160deg, rgba(18, 18, 18, 0.96), rgba(46, 13, 8, 0.88))",
        color: "#fff7ed",
        padding: "1.25rem",
        display: "grid",
        gap: "1rem",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#f4b862",
        }}
      >
        {sequence.sourceKind.replace("-", " ")}
      </p>
      <h1 style={{ margin: 0 }}>{sequence.title}</h1>
      {notice ? <p style={{ margin: 0 }}>{notice}</p> : null}
      <p style={{ margin: 0, fontSize: "1.1rem" }}>
        {engine.frame.currentInterval
          ? `Now: ${engine.frame.currentInterval.label}`
          : engine.frame.state === "prep"
            ? "Get ready"
            : "Workout complete"}
      </p>
      <p style={{ margin: 0, color: "rgba(255, 247, 237, 0.8)" }}>
        {engine.frame.nextInterval
          ? `Next: ${engine.frame.nextInterval.label}`
          : "Next: Finish"}
      </p>
      <p style={{ margin: 0, fontSize: "2.4rem", fontWeight: 700 }}>
        {formatDuration(engine.frame.totalRemainingMs)}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "0.45rem",
        }}
      >
        <button type="button" onClick={engine.previous}>
          Prev
        </button>
        {engine.session.status === "running" ? (
          <button type="button" onClick={engine.pause}>
            Pause
          </button>
        ) : (
          <button type="button" onClick={engine.resume}>
            Resume
          </button>
        )}
        <button type="button" onClick={engine.next}>
          Next
        </button>
        <button type="button" onClick={engine.reset}>
          Reset
        </button>
      </div>
    </section>
  );
}