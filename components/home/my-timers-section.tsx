import type { PersonalTimerSummarySection } from "../../src/features/home/server/get-home-view-model";

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) {
    return `${seconds}s`;
  }

  if (seconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${seconds}s`;
}

interface MyTimersSectionProps {
  section: PersonalTimerSummarySection;
}

export function MyTimersSection({ section }: MyTimersSectionProps) {
  return (
    <section
      data-testid="home-section-my-timers"
      style={{
        display: "grid",
        gap: "0.9rem",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "1.35rem",
          }}
        >
          {section.title}
        </h2>
        <p
          style={{
            margin: "0.4rem 0 0",
            color: "#5a544d",
          }}
        >
          {section.description}
        </p>
      </div>
      {section.items.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: "0.85rem",
          }}
        >
          {section.items.map((timer) => (
            <article
              key={timer.id}
              style={{
                borderRadius: "1.4rem",
                padding: "1rem",
                backgroundColor: "#fff8f0",
                border: "1px solid rgba(140, 92, 22, 0.14)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.8rem",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                  }}
                >
                  {timer.name}
                </h3>
                {timer.isDraft ? (
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "999px",
                      backgroundColor: "rgba(140, 92, 22, 0.12)",
                      color: "#8c5c16",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Draft
                  </span>
                ) : null}
              </div>
              <p
                style={{
                  margin: "0.55rem 0 0",
                  color: "#4b453d",
                }}
              >
                {timer.sourceLabel} • {formatDuration(timer.totalSeconds)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p
          style={{
            margin: 0,
            padding: "1rem",
            borderRadius: "1.2rem",
            backgroundColor: "rgba(255, 255, 255, 0.72)",
            color: "#4f493f",
          }}
        >
          {section.emptyState}
        </p>
      )}
    </section>
  );
}
