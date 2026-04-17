import Link from "next/link";

import { GoogleSignInButton } from "../../src/features/auth/components/google-sign-in-button";
import type {
  HomeViewModel,
  OfficialTemplatesSection,
  PersonalTimerSummarySection,
} from "../../src/features/home/server/get-home-view-model";
import { ProfileChip } from "../header/profile-chip";

interface HomeScreenProps {
  viewModel: HomeViewModel;
}

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

function renderSection(section: HomeViewModel["sections"][number]) {
  if (section.kind === "my-timers") {
    const timerSection = section as PersonalTimerSummarySection;

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
            {timerSection.title}
          </h2>
          <p
            style={{
              margin: "0.4rem 0 0",
              color: "#5a544d",
            }}
          >
            {timerSection.description}
          </p>
        </div>
        {timerSection.items.length > 0 ? (
          <div
            style={{
              display: "grid",
              gap: "0.85rem",
            }}
          >
            {timerSection.items.map((timer) => (
              <article
                key={timer.id}
                data-testid={`home-timer-card-${timer.id}`}
                style={{
                  borderRadius: "1.4rem",
                  padding: "1rem",
                  backgroundColor: "#fff8f0",
                  border: "1px solid rgba(140, 92, 22, 0.14)",
                  display: "grid",
                  gap: "0.7rem",
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
                  <Link
                    href={`/timers/${timer.id}`}
                    style={{
                      textDecoration: "none",
                      color: "#1c1814",
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
                  </Link>
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
                    margin: 0,
                    color: "#4b453d",
                  }}
                >
                  {timer.sourceLabel} | {formatDuration(timer.totalSeconds)}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "0.6rem",
                  }}
                >
                  <Link
                    href={`/run?timerId=${timer.id}`}
                    data-testid={`home-run-now-${timer.id}`}
                    style={{
                      textDecoration: "none",
                      textAlign: "center",
                      borderRadius: "0.95rem",
                      padding: "0.75rem 0.85rem",
                      backgroundColor: "#1c1814",
                      color: "#f8ecda",
                      fontWeight: 700,
                    }}
                  >
                    Run now
                  </Link>
                  <Link
                    href={`/timers/${timer.id}`}
                    style={{
                      textDecoration: "none",
                      textAlign: "center",
                      borderRadius: "0.95rem",
                      padding: "0.75rem 0.85rem",
                      border: "1px solid rgba(140, 92, 22, 0.18)",
                      color: "#1c1814",
                      fontWeight: 700,
                      backgroundColor: "rgba(255, 255, 255, 0.75)",
                    }}
                  >
                    Review
                  </Link>
                </div>
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
            {timerSection.emptyState}
          </p>
        )}
      </section>
    );
  }

  const templateSection = section as OfficialTemplatesSection;

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
          {templateSection.title}
        </h2>
        <p
          style={{
            margin: "0.4rem 0 0",
            color: "#5a544d",
          }}
        >
          {templateSection.description}
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gap: "0.85rem",
        }}
      >
        {templateSection.items.map((template) => (
          <article
            key={template.id}
            data-testid={`official-template-card-${template.slug}`}
            style={{
              display: "grid",
              gap: "0.55rem",
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
            <Link
              href={`/templates/${template.slug}`}
              style={{
                textDecoration: "none",
                color: "#1c1814",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                }}
              >
                {template.title}
              </h3>
            </Link>
            <p
              style={{
                margin: 0,
                color: "#4b453d",
              }}
            >
              {template.summary}
            </p>
            <p
              style={{
                margin: 0,
                color: "#5a544d",
              }}
            >
              {template.intervalCount} intervals | {formatDuration(template.totalSeconds)}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "0.6rem",
              }}
            >
              <Link
                href={`/run?templateSlug=${template.slug}`}
                data-testid={`home-template-run-now-${template.slug}`}
                style={{
                  textDecoration: "none",
                  textAlign: "center",
                  borderRadius: "0.95rem",
                  padding: "0.75rem 0.85rem",
                  backgroundColor: "#1c1814",
                  color: "#f8ecda",
                  fontWeight: 700,
                }}
              >
                Run now
              </Link>
              <Link
                href={`/templates/${template.slug}`}
                style={{
                  textDecoration: "none",
                  textAlign: "center",
                  borderRadius: "0.95rem",
                  padding: "0.75rem 0.85rem",
                  border: "1px solid rgba(140, 92, 22, 0.18)",
                  color: "#1c1814",
                  fontWeight: 700,
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                }}
              >
                Review
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HomeScreen({ viewModel }: HomeScreenProps) {
  return (
    <section
      data-testid="home-screen"
      style={{
        display: "grid",
        gap: "1.5rem",
      }}
    >
      <header
        style={{
          display: "grid",
          gap: "1rem",
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
              gap: "0.55rem",
            }}
          >
            <p
              data-testid="auth-status"
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
                  viewModel.auth.kind === "signed-in"
                    ? "rgba(27, 111, 92, 0.13)"
                    : "rgba(140, 92, 22, 0.12)",
                color:
                  viewModel.auth.kind === "signed-in" ? "#1b6f5c" : "#8c5c16",
              }}
            >
              {viewModel.authStatusLabel}
            </p>
            <div>
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
                No Doubt Fitness Timer
              </p>
              <h1
                style={{
                  margin: "0.35rem 0 0",
                  fontSize: "2rem",
                  lineHeight: 1.05,
                }}
              >
                {viewModel.heading}
              </h1>
            </div>
          </div>
          {viewModel.profile ? <ProfileChip profile={viewModel.profile} /> : null}
        </div>
        <div
          style={{
            display: "grid",
            gap: "0.85rem",
            padding: "1.1rem",
            borderRadius: "1.5rem",
            background:
              "linear-gradient(145deg, rgba(255, 248, 240, 0.96), rgba(245, 224, 196, 0.92))",
            border: "1px solid rgba(140, 92, 22, 0.14)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#433d35",
            }}
          >
            {viewModel.description}
          </p>
          {viewModel.email ? (
            <p
              data-testid="signed-in-email"
              style={{
                margin: 0,
                color: "#5a544d",
                fontWeight: 600,
              }}
            >
              {viewModel.email}
            </p>
          ) : null}
          {viewModel.showGoogleSignIn ? (
            <div
              style={{
                display: "grid",
                gap: "0.65rem",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#5a544d",
                }}
              >
                Keep browsing now, then sign in only when you want saved timers
                to follow you back.
              </p>
              <GoogleSignInButton />
            </div>
          ) : null}
        </div>
      </header>
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
        }}
      >
        {viewModel.sections.map((section) => (
          <div key={section.kind}>{renderSection(section)}</div>
        ))}
      </div>
    </section>
  );
}

