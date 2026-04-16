import type { ReactNode } from "react";

import Link from "next/link";

import { ProfileChip } from "../header/profile-chip";
import type { LibraryViewModel } from "../../src/features/timers/server/get-library-view-model";

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

function formatUpdatedAt(updatedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(updatedAt));
}

interface LibraryScreenProps {
  viewModel: LibraryViewModel;
  notice?: string | null;
  actions?: Record<string, ReactNode>;
}

export function LibraryScreen({
  viewModel,
  notice = null,
  actions = {},
}: LibraryScreenProps) {
  const isSignedIn = viewModel.auth.kind === "signed-in";

  return (
    <section
      data-testid="library-screen"
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
              data-testid="library-auth-status"
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
                Personal Library
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
          <p
            data-testid="library-status-summary"
            style={{
              margin: 0,
              color: "#5a544d",
              fontWeight: 600,
            }}
          >
            {viewModel.statusSummary}
          </p>
          {isSignedIn ? (
            <form
              action="/library"
              method="get"
              style={{
                display: "grid",
                gap: "0.6rem",
              }}
            >
              <label
                htmlFor="library-search"
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#433d35",
                }}
              >
                Search timers by name
              </label>
              <div
                style={{
                  display: "flex",
                  gap: "0.65rem",
                }}
              >
                <input
                  id="library-search"
                  name="q"
                  defaultValue={viewModel.searchQuery}
                  placeholder="Search your library"
                  style={{
                    flex: 1,
                    borderRadius: "1rem",
                    border: "1px solid rgba(140, 92, 22, 0.22)",
                    padding: "0.85rem 1rem",
                    fontSize: "1rem",
                    color: "#2b2520",
                    backgroundColor: "rgba(255, 255, 255, 0.88)",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    border: "none",
                    borderRadius: "1rem",
                    padding: "0.85rem 1rem",
                    fontWeight: 700,
                    backgroundColor: "#1c1814",
                    color: "#f8ecda",
                  }}
                >
                  Search
                </button>
              </div>
              {viewModel.searchQuery ? (
                <Link
                  href="/library"
                  style={{
                    width: "fit-content",
                    color: "#8c5c16",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Clear search
                </Link>
              ) : null}
            </form>
          ) : (
            <Link
              href="/"
              style={{
                width: "fit-content",
                borderRadius: "999px",
                padding: "0.75rem 1rem",
                textDecoration: "none",
                fontWeight: 700,
                backgroundColor: "#1c1814",
                color: "#f8ecda",
              }}
            >
              Return home
            </Link>
          )}
          {notice ? (
            <p
              data-testid="library-notice"
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
        </div>
      </header>
      {viewModel.items.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: "0.85rem",
          }}
        >
          {viewModel.items.map((timer) => (
            <article
              key={timer.id}
              data-testid={`library-card-${timer.id}`}
              style={{
                display: "grid",
                gap: "0.7rem",
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
                <Link
                  href={timer.detailHref}
                  style={{
                    color: "#1c1814",
                    textDecoration: "none",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "1.05rem",
                    }}
                  >
                    {timer.name}
                  </h2>
                </Link>
                {timer.draftLabel ? (
                  <span
                    data-testid={`library-draft-${timer.id}`}
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
                    {timer.draftLabel}
                  </span>
                ) : null}
              </div>
              {timer.description ? (
                <p
                  style={{
                    margin: 0,
                    color: "#4b453d",
                  }}
                >
                  {timer.description}
                </p>
              ) : null}
              <p
                style={{
                  margin: 0,
                  color: "#5a544d",
                }}
              >
                {timer.sourceLabel} | {timer.intervalCount} intervals |{" "}
                {formatDuration(timer.totalSeconds)}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "#6a635a",
                  fontSize: "0.9rem",
                }}
              >
                Updated {formatUpdatedAt(timer.updatedAt)}
              </p>
              {actions[timer.id] ? <div>{actions[timer.id]}</div> : null}
            </article>
          ))}
        </div>
      ) : (
        <div
          data-testid="library-empty-state"
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
