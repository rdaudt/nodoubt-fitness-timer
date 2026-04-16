import type { ReactNode } from "react";

import Link from "next/link";

import type { AuthContext } from "../../src/features/auth/server/get-auth-context";
import { ProfileChip } from "../header/profile-chip";

export interface QuickCreateField {
  name: string;
  label: string;
  helpText: string;
  defaultValue: number;
  min: number;
  max: number;
  step?: number;
}

interface QuickCreateFormProps {
  auth: AuthContext;
  title: string;
  description: string;
  eyebrow: string;
  submitLabel: string;
  backHref?: string;
  action: (formData: FormData) => void | Promise<void>;
  fields: QuickCreateField[];
  footer?: ReactNode;
}

export function QuickCreateForm({
  auth,
  title,
  description,
  eyebrow,
  submitLabel,
  backHref = "/create",
  action,
  fields,
  footer,
}: QuickCreateFormProps) {
  const isSignedIn = auth.kind === "signed-in";

  return (
    <section
      data-testid="quick-create-form"
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
              {eyebrow}
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: "2rem",
                lineHeight: 1.05,
              }}
            >
              {title}
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
            data-testid="quick-create-auth-status"
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
            {description}
          </p>
        </div>
      </header>
      <form
        action={action}
        style={{
          display: "grid",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "0.85rem",
          }}
        >
          {fields.map((field) => (
            <label
              key={field.name}
              style={{
                display: "grid",
                gap: "0.45rem",
                padding: "0.95rem",
                borderRadius: "1.2rem",
                backgroundColor: "#fff8f0",
                border: "1px solid rgba(140, 92, 22, 0.14)",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: "#2d2721",
                }}
              >
                {field.label}
              </span>
              <input
                name={field.name}
                type="number"
                min={field.min}
                max={field.max}
                step={field.step ?? 1}
                defaultValue={field.defaultValue}
                data-testid={`quick-create-input-${field.name}`}
                style={{
                  borderRadius: "1rem",
                  border: "1px solid rgba(140, 92, 22, 0.22)",
                  padding: "0.8rem 0.9rem",
                  fontSize: "1rem",
                  color: "#2b2520",
                  backgroundColor: "rgba(255, 255, 255, 0.92)",
                }}
              />
              <span
                style={{
                  color: "#5a544d",
                  fontSize: "0.92rem",
                }}
              >
                {field.helpText}
              </span>
            </label>
          ))}
        </div>
        {footer}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: "0.75rem",
          }}
        >
          <Link
            href={backHref}
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
          <button
            type="submit"
            data-testid="quick-create-submit"
            style={{
              border: "none",
              borderRadius: "1rem",
              padding: "0.9rem 1.05rem",
              fontWeight: 700,
              backgroundColor: "#f2bb67",
              color: "#1c1814",
            }}
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
}
