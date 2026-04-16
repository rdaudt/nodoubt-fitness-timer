import type { ReactNode } from "react";

import { ProfileChip } from "../header/profile-chip";
import type { TimerDetailViewModel } from "../../src/features/timers/server/get-timer-detail-view-model";

interface TimerDetailScreenProps {
  viewModel: TimerDetailViewModel;
  actions?: ReactNode;
}

export function TimerDetailScreen({
  viewModel,
  actions,
}: TimerDetailScreenProps) {
  const isSignedIn = viewModel.auth.kind === "signed-in";
  const isReady = viewModel.state === "ready";

  return (
    <section
      data-testid="timer-detail-screen"
      style={{
        display: "grid",
        gap: "1.25rem",
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
              gap: "0.5rem",
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
              {viewModel.eyebrow}
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "2rem",
                lineHeight: 1.05,
              }}
            >
              {viewModel.title}
            </h1>
          </div>
          {viewModel.profile ? <ProfileChip profile={viewModel.profile} /> : null}
        </div>
        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            padding: "1.1rem",
            borderRadius: "1.5rem",
            background:
              "linear-gradient(145deg, rgba(255, 248, 240, 0.96), rgba(245, 224, 196, 0.92))",
            border: "1px solid rgba(140, 92, 22, 0.14)",
          }}
        >
          <p
            data-testid="detail-auth-status"
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
              backgroundColor: isSignedIn
                ? "rgba(27, 111, 92, 0.13)"
                : "rgba(140, 92, 22, 0.12)",
              color: isSignedIn ? "#1b6f5c" : "#8c5c16",
            }}
          >
            {viewModel.authStatusLabel}
          </p>
          <p
            style={{
              margin: 0,
              color: "#433d35",
            }}
          >
            {viewModel.description}
          </p>
          {viewModel.primaryBadge ? (
            <span
              data-testid="detail-primary-badge"
              style={{
                display: "inline-flex",
                width: "fit-content",
                padding: "0.25rem 0.55rem",
                borderRadius: "999px",
                backgroundColor: "rgba(140, 92, 22, 0.12)",
                color: "#8c5c16",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {viewModel.primaryBadge}
            </span>
          ) : null}
          {viewModel.notice ? (
            <p
              data-testid="detail-notice"
              style={{
                margin: 0,
                padding: "0.8rem 0.9rem",
                borderRadius: "1rem",
                backgroundColor: "rgba(28, 24, 20, 0.9)",
                color: "#f8ecda",
                fontWeight: 600,
              }}
            >
              {viewModel.notice}
            </p>
          ) : null}
          {viewModel.metaItems.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {viewModel.metaItems.map((item) => (
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
          ) : null}
        </div>
      </header>
      {isReady ? (
        <>
          {actions ? (
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
                Actions
              </h2>
              {actions}
            </section>
          ) : null}
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
              Interval Breakdown
            </h2>
            <div
              style={{
                display: "grid",
                gap: "0.7rem",
              }}
            >
              {viewModel.intervals.map((interval, index) => (
                <article
                  key={interval.id}
                  data-testid={`detail-interval-${interval.id}`}
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
                    {interval.kindLabel} | {interval.durationLabel}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "0.45rem",
            padding: "1rem",
            borderRadius: "1.2rem",
            backgroundColor: "rgba(255, 255, 255, 0.72)",
            color: "#4f493f",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.1rem",
            }}
          >
            {viewModel.emptyStateTitle}
          </h2>
          <p
            style={{
              margin: 0,
            }}
          >
            {viewModel.emptyStateDescription}
          </p>
        </div>
      )}
    </section>
  );
}
