"use client";

interface RunControlsProps {
  isRunning: boolean;
  controlsLocked: boolean;
  resetConfirming: boolean;
  exitConfirming: boolean;
  canJumpPrevious: boolean;
  canJumpNext: boolean;
  onPauseResume: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onResetRequest: () => void;
  onResetCancel: () => void;
  onResetConfirm: () => void;
  onExitRequest: () => void;
  onExitCancel: () => void;
  onExitConfirm: () => void;
  onToggleLock: () => void;
}

export function RunControls({
  isRunning,
  controlsLocked,
  resetConfirming,
  exitConfirming,
  canJumpPrevious,
  canJumpNext,
  onPauseResume,
  onPrevious,
  onNext,
  onResetRequest,
  onResetCancel,
  onResetConfirm,
  onExitRequest,
  onExitCancel,
  onExitConfirm,
  onToggleLock,
}: RunControlsProps) {
  const disablePlaybackButtons = controlsLocked;

  return (
    <section
      data-testid="run-controls"
      style={{
        display: "grid",
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "0.55rem",
        }}
      >
        <button
          type="button"
          data-testid="run-control-previous"
          onClick={onPrevious}
          disabled={disablePlaybackButtons || !canJumpPrevious}
          style={buttonStyle(disablePlaybackButtons || !canJumpPrevious)}
        >
          Prev
        </button>
        <button
          type="button"
          data-testid={isRunning ? "run-control-pause" : "run-control-resume"}
          onClick={onPauseResume}
          disabled={disablePlaybackButtons}
          style={buttonStyle(disablePlaybackButtons)}
        >
          {isRunning ? "Pause" : "Resume"}
        </button>
        <button
          type="button"
          data-testid="run-control-next"
          onClick={onNext}
          disabled={disablePlaybackButtons || !canJumpNext}
          style={buttonStyle(disablePlaybackButtons || !canJumpNext)}
        >
          Next
        </button>
        <button
          type="button"
          data-testid="run-control-reset"
          onClick={onResetRequest}
          disabled={disablePlaybackButtons}
          style={buttonStyle(disablePlaybackButtons, true)}
        >
          Reset
        </button>
      </div>
      {resetConfirming ? (
        <div
          data-testid="run-reset-confirm"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto auto",
            gap: "0.5rem",
            alignItems: "center",
            borderRadius: "0.9rem",
            padding: "0.55rem 0.65rem",
            backgroundColor: "rgba(194, 77, 54, 0.2)",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600, color: "#ffe1d6" }}>
            Reset this run?
          </p>
          <button
            type="button"
            data-testid="run-control-reset-cancel"
            onClick={onResetCancel}
            style={inlineButtonStyle(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            data-testid="run-control-reset-confirm"
            onClick={onResetConfirm}
            style={inlineButtonStyle(true)}
          >
            Confirm
          </button>
        </div>
      ) : null}
      {exitConfirming ? (
        <div
          data-testid="run-exit-confirm"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto auto",
            gap: "0.5rem",
            alignItems: "center",
            borderRadius: "0.9rem",
            padding: "0.55rem 0.65rem",
            backgroundColor: "rgba(255, 244, 238, 0.16)",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600, color: "#fff4ee" }}>
            Exit this run?
          </p>
          <button
            type="button"
            data-testid="run-control-exit-cancel"
            onClick={onExitCancel}
            style={inlineButtonStyle(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            data-testid="run-control-exit-confirm"
            onClick={onExitConfirm}
            style={inlineButtonStyle(true)}
          >
            Confirm
          </button>
        </div>
      ) : null}
      <button
        type="button"
        data-testid="run-control-exit"
        onClick={onExitRequest}
        disabled={disablePlaybackButtons}
        style={{
          border: "1px solid rgba(255, 244, 238, 0.24)",
          borderRadius: "0.95rem",
          padding: "0.75rem",
          fontWeight: 700,
          backgroundColor: "rgba(255, 244, 238, 0.06)",
          color: "#fff4ee",
          opacity: disablePlaybackButtons ? 0.45 : 1,
        }}
      >
        Exit run
      </button>
      <button
        type="button"
        data-testid={controlsLocked ? "run-control-unlock" : "run-control-lock"}
        onClick={onToggleLock}
        style={{
          border: "1px solid rgba(255, 244, 238, 0.24)",
          borderRadius: "0.95rem",
          padding: "0.75rem",
          fontWeight: 700,
          backgroundColor: controlsLocked
            ? "rgba(255, 244, 238, 0.14)"
            : "rgba(255, 244, 238, 0.06)",
          color: "#fff4ee",
        }}
      >
        {controlsLocked ? "Unlock controls" : "Lock controls"}
      </button>
    </section>
  );
}

function buttonStyle(disabled: boolean, destructive = false) {
  return {
    border: destructive ? "none" : "1px solid rgba(255, 244, 238, 0.2)",
    borderRadius: "0.9rem",
    padding: "0.75rem 0.5rem",
    fontWeight: 700,
    color: destructive ? "#2b0f08" : "#fff4ee",
    backgroundColor: disabled
      ? "rgba(255, 244, 238, 0.14)"
      : destructive
        ? "#f2bb67"
        : "rgba(255, 244, 238, 0.06)",
    opacity: disabled ? 0.45 : 1,
  };
}

function inlineButtonStyle(primary: boolean) {
  return {
    border: primary ? "none" : "1px solid rgba(255, 244, 238, 0.25)",
    borderRadius: "0.75rem",
    padding: "0.45rem 0.65rem",
    fontWeight: 700,
    backgroundColor: primary ? "#f2bb67" : "transparent",
    color: primary ? "#2b0f08" : "#fff4ee",
  };
}
