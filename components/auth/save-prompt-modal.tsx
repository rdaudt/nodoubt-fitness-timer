"use client";

import type { ReactNode } from "react";

interface SavePromptModalProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}

export function SavePromptModal({
  open,
  title,
  description,
  onClose,
  children,
}: SavePromptModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      data-testid="save-prompt-modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "grid",
        placeItems: "center",
        padding: "1.25rem",
        backgroundColor: "rgba(28, 24, 20, 0.54)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: "100%",
          maxWidth: "28rem",
          display: "grid",
          gap: "0.9rem",
          borderRadius: "1.5rem",
          padding: "1.2rem",
          backgroundColor: "#fff8f0",
          boxShadow: "0 24px 48px rgba(28, 24, 20, 0.22)",
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
            <h2
              style={{
                margin: 0,
                fontSize: "1.2rem",
              }}
            >
              {title}
            </h2>
            <p
              style={{
                margin: 0,
                color: "#4f493f",
              }}
            >
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid="save-prompt-dismiss"
            style={{
              border: "none",
              backgroundColor: "transparent",
              color: "#6a635a",
              fontSize: "1.1rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gap: "0.7rem",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
