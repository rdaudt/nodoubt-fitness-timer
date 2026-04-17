"use client";

interface CompletionScreenProps {
  title: string;
  elapsedLabel: string;
  onRunAgain: () => void;
  onReturnHome: () => void;
}

export function CompletionScreen({
  title,
  elapsedLabel,
  onRunAgain,
  onReturnHome,
}: CompletionScreenProps) {
  return (
    <section
      data-testid="run-completion-screen"
      style={{
        minHeight: "100vh",
        display: "grid",
        alignContent: "center",
        gap: "1rem",
        padding: "1.1rem",
        maxWidth: "30rem",
        margin: "0 auto",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.76rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#f4b862",
          fontWeight: 700,
        }}
      >
        Workout complete
      </p>
      <h1
        data-testid="run-completion-title"
        style={{
          margin: 0,
          fontSize: "2.1rem",
          lineHeight: 1.03,
        }}
      >
        {title}
      </h1>
      <p
        data-testid="run-completion-elapsed"
        style={{
          margin: 0,
          color: "rgba(255, 247, 237, 0.85)",
          fontWeight: 600,
        }}
      >
        Total elapsed: {elapsedLabel}
      </p>
      <div
        style={{
          display: "grid",
          gap: "0.7rem",
        }}
      >
        <button
          type="button"
          data-testid="run-completion-home"
          onClick={onReturnHome}
          style={{
            border: "none",
            borderRadius: "0.95rem",
            padding: "0.8rem 0.9rem",
            fontWeight: 700,
            backgroundColor: "#f2bb67",
            color: "#2b0f08",
          }}
        >
          Return home
        </button>
        <button
          type="button"
          data-testid="run-completion-run-again"
          onClick={onRunAgain}
          style={{
            border: "1px solid rgba(255, 244, 238, 0.24)",
            borderRadius: "0.95rem",
            padding: "0.8rem 0.9rem",
            fontWeight: 700,
            backgroundColor: "rgba(255, 244, 238, 0.07)",
            color: "#fff4ee",
          }}
        >
          Run again
        </button>
      </div>
    </section>
  );
}
