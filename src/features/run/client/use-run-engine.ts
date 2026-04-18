"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  createDeviceFeedbackController,
  type DeviceFeedbackCapabilities,
  type DeviceFeedbackController,
} from "./device-feedback";
import type { RunSessionSnapshot } from "../contracts/run-session";
import type { RunSequence } from "../contracts/run-sequence";
import { deriveRunFrame } from "../engine/derive-run-frame";
import { PLAYBACK_DEFAULTS } from "../contracts/playback-defaults";

export interface RunEngineClock {
  nowMonotonicMs: () => number;
  nowEpochMs: () => number;
}

export interface RunEngineOptions {
  tickMs?: number;
  clock?: RunEngineClock;
  initialSession?: RunSessionSnapshot | null;
  feedback?: DeviceFeedbackController;
}

const DEFAULT_TICK_MS = 200;

function defaultClock(): RunEngineClock {
  return {
    nowMonotonicMs: () =>
      typeof performance === "undefined" ? Date.now() : performance.now(),
    nowEpochMs: () => Date.now(),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function deriveElapsedMs(session: RunSessionSnapshot, nowMonotonicMs: number) {
  const pausedAt =
    session.status === "paused" && session.pausedAtMonotonicMs !== null
      ? session.pausedAtMonotonicMs
      : nowMonotonicMs;

  return clamp(
    pausedAt - session.anchorMonotonicMs - session.totalPausedMs + session.manualOffsetMs,
    0,
    Number.MAX_SAFE_INTEGER,
  );
}

function toUpdatedSession(
  session: RunSessionSnapshot,
  updates: Partial<RunSessionSnapshot>,
  nowEpochMs: number,
): RunSessionSnapshot {
  return {
    ...session,
    ...updates,
    updatedAtEpochMs: nowEpochMs,
  };
}

function createFreshSession(sequence: RunSequence, clock: RunEngineClock): RunSessionSnapshot {
  const nowMonotonicMs = clock.nowMonotonicMs();
  const nowEpochMs = clock.nowEpochMs();

  return {
    sessionId: crypto.randomUUID(),
    sequenceId: sequence.id,
    sourceKind: sequence.sourceKind,
    sourceRef: sequence.sourceRef,
    status: "running",
    anchorMonotonicMs: nowMonotonicMs,
    totalPausedMs: 0,
    pausedAtMonotonicMs: null,
    manualOffsetMs: 0,
    startedAtEpochMs: nowEpochMs,
    lastElapsedMs: 0,
    updatedAtEpochMs: nowEpochMs,
  };
}

function resolveInitialSession(
  sequence: RunSequence,
  provided: RunSessionSnapshot | null | undefined,
  clock: RunEngineClock,
) {
  if (
    provided &&
    provided.sequenceId === sequence.id &&
    provided.sourceKind === sequence.sourceKind &&
    provided.sourceRef === sequence.sourceRef
  ) {
    return provided;
  }

  return createFreshSession(sequence, clock);
}

interface JumpAction {
  type: "jump";
  targetElapsedMs: number;
}

interface PauseAction {
  type: "pause";
}

interface ResumeAction {
  type: "resume";
}

interface ResetAction {
  type: "reset";
}

interface CompleteAction {
  type: "complete";
}

export type RunControlAction =
  | JumpAction
  | PauseAction
  | ResumeAction
  | ResetAction
  | CompleteAction;

export function applyRunControlAction(
  sequence: RunSequence,
  session: RunSessionSnapshot,
  action: RunControlAction,
  clock: RunEngineClock,
): RunSessionSnapshot {
  const nowMonotonicMs = clock.nowMonotonicMs();
  const nowEpochMs = clock.nowEpochMs();

  switch (action.type) {
    case "pause": {
      if (session.status !== "running") {
        return session;
      }

      return toUpdatedSession(
        session,
        {
          status: "paused",
          pausedAtMonotonicMs: nowMonotonicMs,
          lastElapsedMs: deriveElapsedMs(session, nowMonotonicMs),
        },
        nowEpochMs,
      );
    }
    case "resume": {
      if (session.status !== "paused" || session.pausedAtMonotonicMs === null) {
        return session;
      }

      return toUpdatedSession(
        session,
        {
          status: "running",
          totalPausedMs:
            session.totalPausedMs + (nowMonotonicMs - session.pausedAtMonotonicMs),
          pausedAtMonotonicMs: null,
        },
        nowEpochMs,
      );
    }
    case "jump": {
      const currentElapsedMs = deriveElapsedMs(session, nowMonotonicMs);

      return toUpdatedSession(
        session,
        {
          manualOffsetMs:
            session.manualOffsetMs + (action.targetElapsedMs - currentElapsedMs),
          status: "running",
          pausedAtMonotonicMs: null,
          lastElapsedMs: clamp(action.targetElapsedMs, 0, sequence.totalDurationMs),
        },
        nowEpochMs,
      );
    }
    case "reset": {
      return {
        ...createFreshSession(sequence, clock),
        sessionId: session.sessionId,
        sequenceId: session.sequenceId,
        sourceKind: session.sourceKind,
        sourceRef: session.sourceRef,
      };
    }
    case "complete": {
      return toUpdatedSession(
        session,
        {
          status: "completed",
          pausedAtMonotonicMs: nowMonotonicMs,
          lastElapsedMs: sequence.totalDurationMs,
        },
        nowEpochMs,
      );
    }
    default:
      return session;
  }
}

export function useRunEngine(sequence: RunSequence, options: RunEngineOptions = {}) {
  const clock = useMemo(
    () => options.clock ?? defaultClock(),
    [options.clock],
  );
  const feedback = useMemo(
    () => options.feedback ?? createDeviceFeedbackController(),
    [options.feedback],
  );
  const tickMs = options.tickMs ?? DEFAULT_TICK_MS;
  const [session, setSession] = useState<RunSessionSnapshot>(() =>
    resolveInitialSession(sequence, options.initialSession, clock),
  );
  const [nowMonotonicMs, setNowMonotonicMs] = useState(() =>
    clock.nowMonotonicMs(),
  );
  const [capabilities, setCapabilities] = useState<DeviceFeedbackCapabilities>(() =>
    feedback.getCapabilities(),
  );
  const previousIntervalIdRef = useRef<string | null>(null);
  const countdownCueKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setSession(resolveInitialSession(sequence, options.initialSession, clock));
    setNowMonotonicMs(clock.nowMonotonicMs());
    setCapabilities(feedback.getCapabilities());
    previousIntervalIdRef.current = null;
    countdownCueKeysRef.current = new Set();
  }, [clock, options.initialSession, sequence]);

  useEffect(() => {
    if (session.status !== "running") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNowMonotonicMs(clock.nowMonotonicMs());
    }, tickMs);

    return () => window.clearInterval(intervalId);
  }, [clock, session.status, tickMs]);

  const elapsedMs = useMemo(
    () => deriveElapsedMs(session, nowMonotonicMs),
    [nowMonotonicMs, session],
  );

  const frame = useMemo(() => deriveRunFrame(sequence, elapsedMs), [elapsedMs, sequence]);

  useEffect(() => {
    let mounted = true;

    const syncStatus = async () => {
      await feedback.syncPlaybackStatus(session.status);

      if (mounted) {
        setCapabilities(feedback.getCapabilities());
      }
    };

    void syncStatus();

    return () => {
      mounted = false;
    };
  }, [feedback, session.status]);

  useEffect(() => {
    if (frame.state !== "running" || session.status !== "running") {
      previousIntervalIdRef.current = frame.currentInterval?.id ?? null;
      return;
    }

    const currentIntervalId = frame.currentInterval?.id ?? null;
    const previousIntervalId = previousIntervalIdRef.current;

    if (currentIntervalId && currentIntervalId !== previousIntervalId) {
      feedback.emitTransitionCue();
      setCapabilities(feedback.getCapabilities());
      countdownCueKeysRef.current.clear();
    }

    previousIntervalIdRef.current = currentIntervalId;

    if (!frame.currentInterval) {
      return;
    }

    const secondsRemaining = Math.ceil(
      Math.max(0, frame.progress.intervalRemainingMs) / 1_000,
    );

    if (
      !PLAYBACK_DEFAULTS.finalCountdownSeconds.some(
        (value) => value === secondsRemaining,
      )
    ) {
      return;
    }

    const cueKey = `${frame.currentInterval.id}:${secondsRemaining}`;

    if (countdownCueKeysRef.current.has(cueKey)) {
      return;
    }

    feedback.emitFinalCountdownCue(secondsRemaining);
    countdownCueKeysRef.current.add(cueKey);
    setCapabilities(feedback.getCapabilities());
  }, [feedback, frame, session.status]);

  useEffect(
    () => () => {
      void feedback.stop();
    },
    [feedback],
  );

  useEffect(() => {
    if (frame.state !== "completed" || session.status === "completed") {
      return;
    }

    setSession((currentSession) =>
      applyRunControlAction(sequence, currentSession, { type: "complete" }, clock),
    );
  }, [clock, frame.state, sequence, session.status]);

  const pause = () => {
    setSession((currentSession) =>
      applyRunControlAction(sequence, currentSession, { type: "pause" }, clock),
    );
  };

  const resume = () => {
    setSession((currentSession) =>
      applyRunControlAction(sequence, currentSession, { type: "resume" }, clock),
    );
  };

  const reset = () => {
    setSession((currentSession) =>
      applyRunControlAction(sequence, currentSession, { type: "reset" }, clock),
    );
  };

  const jumpToElapsed = (targetElapsedMs: number) => {
    setSession((currentSession) =>
      applyRunControlAction(
        sequence,
        currentSession,
        {
          type: "jump",
          targetElapsedMs: clamp(targetElapsedMs, 0, sequence.totalDurationMs),
        },
        clock,
      ),
    );
    setNowMonotonicMs(clock.nowMonotonicMs());
  };

  const next = () => {
    if (!frame.nextInterval) {
      jumpToElapsed(sequence.totalDurationMs);
      return;
    }

    jumpToElapsed(sequence.prepDurationMs + frame.nextInterval.startMs);
  };

  const previous = () => {
    if (!frame.currentInterval) {
      jumpToElapsed(0);
      return;
    }

    const shouldRestartCurrent = frame.progress.elapsedInIntervalMs > 2_000;

    if (shouldRestartCurrent) {
      jumpToElapsed(sequence.prepDurationMs + frame.currentInterval.startMs);
      return;
    }

    const previousInterval = sequence.intervals[frame.currentInterval.index - 1] ?? null;

    if (!previousInterval) {
      jumpToElapsed(0);
      return;
    }

    jumpToElapsed(sequence.prepDurationMs + previousInterval.startMs);
  };

  const primeDeviceFeedback = async () => {
    await feedback.primeFromUserInteraction();
    setCapabilities(feedback.getCapabilities());
  };

  return {
    session,
    frame,
    capabilities,
    primeDeviceFeedback,
    pause,
    resume,
    previous,
    next,
    reset,
  };
}
