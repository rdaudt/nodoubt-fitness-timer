import type { OfficialTemplatesSection } from "../../src/features/home/server/get-home-view-model";

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

interface OfficialTemplatesSectionProps {
  section: OfficialTemplatesSection;
}

export function OfficialTemplatesSection({
  section,
}: OfficialTemplatesSectionProps) {
  return (
    <section
      data-testid="home-section-official-templates"
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
      <div
        style={{
          display: "grid",
          gap: "0.85rem",
        }}
      >
        {section.items.map((template) => (
          <article
            key={template.id}
            style={{
              borderRadius: "1.4rem",
              padding: "1rem",
              backgroundColor: "#fff8f0",
              border: "1px solid rgba(140, 92, 22, 0.14)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8c5c16",
              }}
            >
              {template.workoutType}
            </p>
            <h3
              style={{
                margin: "0.4rem 0 0",
                fontSize: "1rem",
              }}
            >
              {template.title}
            </h3>
            <p
              style={{
                margin: "0.55rem 0 0",
                color: "#4b453d",
              }}
            >
              {template.summary}
            </p>
            <p
              style={{
                margin: "0.7rem 0 0",
                color: "#5a544d",
              }}
            >
              {template.intervalCount} intervals • {formatDuration(template.totalSeconds)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
