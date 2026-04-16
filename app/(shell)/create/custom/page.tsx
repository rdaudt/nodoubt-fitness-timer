import Link from "next/link";

import { CustomCreateEditor } from "../../../../components/create/custom-create-editor";
import { ProfileChip } from "../../../../components/header/profile-chip";
import { getAuthContext } from "../../../../src/features/auth/server/get-auth-context";
import { createCustomDraftState } from "../../../../src/features/create/server/create-custom-draft";

export const dynamic = "force-dynamic";

interface CustomCreatePageProps {
  searchParams?: Promise<{
    notice?: string | string[];
    seed?: string | string[];
  }>;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default async function CustomCreatePage({
  searchParams,
}: CustomCreatePageProps) {
  const auth = await getAuthContext();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const seed = Array.isArray(resolvedSearchParams?.seed)
    ? resolvedSearchParams?.seed[0] ?? null
    : resolvedSearchParams?.seed ?? null;
  const notice = Array.isArray(resolvedSearchParams?.notice)
    ? resolvedSearchParams?.notice[0] ?? null
    : resolvedSearchParams?.notice ?? null;
  const initialDraft = createCustomDraftState(seed);

  if (auth.kind === "guest") {
    return (
      <CustomCreateEditor
        profile={null}
        initialDraft={initialDraft}
        notice={notice}
        useSeededDraft={Boolean(seed)}
      />
    );
  }

  return (
    <section
      data-testid="custom-create-screen"
      style={{
        display: "grid",
        gap: "1.25rem",
      }}
    >
      <header
        style={{
          display: "grid",
          gap: "0.9rem",
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
              gap: "0.45rem",
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
              Custom Timer
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "2rem",
                lineHeight: 1.05,
              }}
            >
              {initialDraft.timer.name}
            </h1>
          </div>
          <ProfileChip profile={auth.profile} />
        </div>
        <div
          style={{
            display: "grid",
            gap: "0.7rem",
            padding: "1rem",
            borderRadius: "1.35rem",
            background:
              "linear-gradient(145deg, rgba(255, 248, 240, 0.96), rgba(245, 224, 196, 0.92))",
            border: "1px solid rgba(140, 92, 22, 0.14)",
          }}
        >
          <p
            data-testid="custom-create-auth-status"
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
              backgroundColor: "rgba(27, 111, 92, 0.13)",
              color: "#1b6f5c",
            }}
          >
            Signed In
          </p>
          <p
            style={{
              margin: 0,
              color: "#433d35",
            }}
          >
            The custom route is now the direct editor entry path. Rich interval
            editing and auto-save land in Plan 02-03, but the draft structure is
            already visible here.
          </p>
          {notice ? (
            <p
              data-testid="custom-create-notice"
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
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                borderRadius: "999px",
                padding: "0.35rem 0.6rem",
                backgroundColor: "rgba(255, 255, 255, 0.78)",
                color: "#433d35",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Draft preview
            </span>
            <span
              style={{
                borderRadius: "999px",
                padding: "0.35rem 0.6rem",
                backgroundColor: "rgba(255, 255, 255, 0.78)",
                color: "#433d35",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              {initialDraft.timer.intervals.length} intervals
            </span>
            <span
              style={{
                borderRadius: "999px",
                padding: "0.35rem 0.6rem",
                backgroundColor: "rgba(255, 255, 255, 0.78)",
                color: "#433d35",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              {formatDuration(initialDraft.timer.totalSeconds)}
            </span>
          </div>
        </div>
      </header>
      <section
        style={{
          display: "grid",
          gap: "0.8rem",
        }}
      >
        {initialDraft.timer.intervals.map((interval, index) => (
          <article
            key={interval.id}
            data-testid={`custom-interval-${interval.id}`}
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
            <h2
              style={{
                margin: 0,
                fontSize: "1rem",
              }}
            >
              {interval.label}
            </h2>
            <p
              style={{
                margin: 0,
                color: "#4b453d",
              }}
            >
              {interval.kind} | {formatDuration(interval.durationSeconds)}
            </p>
          </article>
        ))}
      </section>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "0.75rem",
        }}
      >
        <Link
          href="/create"
          style={{
            borderRadius: "1rem",
            padding: "0.9rem 1rem",
            textAlign: "center",
            textDecoration: "none",
            fontWeight: 700,
            border: "1px solid rgba(140, 92, 22, 0.18)",
            backgroundColor: "rgba(255, 255, 255, 0.78)",
            color: "#1c1814",
          }}
        >
          Back
        </Link>
        <Link
          href={`/timers/timer-monday-burn?notice=${encodeURIComponent(
            "Custom editor interval controls land in Plan 02-03. This route now anchors the direct custom-create entry path.",
          )}`}
          style={{
            borderRadius: "1rem",
            padding: "0.9rem 1rem",
            textAlign: "center",
            textDecoration: "none",
            fontWeight: 700,
            backgroundColor: "#f2bb67",
            color: "#1c1814",
          }}
        >
          Continue to Detail
        </Link>
      </div>
    </section>
  );
}
