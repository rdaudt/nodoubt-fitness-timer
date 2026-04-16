import Link from "next/link";

import type { AuthContext } from "../../src/features/auth/server/get-auth-context";
import { ProfileChip } from "../header/profile-chip";

interface CreateOption {
  href: string;
  title: string;
  description: string;
  accent: string;
  testId: string;
}

interface CreateEntryScreenProps {
  auth: AuthContext;
}

const createOptions: CreateOption[] = [
  {
    href: "/create/hiit",
    title: "HIIT",
    description: "Work and recovery repeats with a fast setup path.",
    accent: "#f2bb67",
    testId: "create-option-hiit",
  },
  {
    href: "/create/circuit",
    title: "Circuit / Tabata",
    description: "Exercise blocks that repeat across rounds.",
    accent: "#8ec5a6",
    testId: "create-option-circuit",
  },
  {
    href: "/create/round",
    title: "Round",
    description: "Timed rounds with rest between efforts.",
    accent: "#7eb6d9",
    testId: "create-option-round",
  },
  {
    href: "/create/custom",
    title: "Custom",
    description: "Open the full editor path and build your own structure.",
    accent: "#e39672",
    testId: "create-option-custom",
  },
];

export function CreateEntryScreen({ auth }: CreateEntryScreenProps) {
  const isSignedIn = auth.kind === "signed-in";

  return (
    <section
      data-testid="create-entry-screen"
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
              Create Timer
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "2rem",
                lineHeight: 1.05,
              }}
            >
              Choose the timer type that fits your workout.
            </h1>
          </div>
          {isSignedIn ? <ProfileChip profile={auth.profile} /> : null}
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
            data-testid="create-entry-auth-status"
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
            {isSignedIn ? "Signed In" : "Guest"}
          </p>
          <p
            style={{
              margin: 0,
              color: "#433d35",
            }}
          >
            Structured quick-create flows generate a valid draft immediately. Custom
            opens the fuller editor path for workouts that need more control.
          </p>
        </div>
      </header>
      <div
        style={{
          display: "grid",
          gap: "0.8rem",
        }}
      >
        {createOptions.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            data-testid={option.testId}
            style={{
              display: "grid",
              gap: "0.4rem",
              padding: "1rem",
              borderRadius: "1.35rem",
              backgroundColor: "#fff8f0",
              border: "1px solid rgba(140, 92, 22, 0.14)",
              textDecoration: "none",
              color: "#1c1814",
              boxShadow: `inset 0 0 0 1px ${option.accent}22`,
            }}
          >
            <span
              style={{
                width: "fit-content",
                padding: "0.32rem 0.58rem",
                borderRadius: "999px",
                backgroundColor: option.accent,
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {option.title}
            </span>
            <span
              style={{
                color: "#4f493f",
              }}
            >
              {option.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
