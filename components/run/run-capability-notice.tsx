"use client";

import type { DeviceFeedbackCapabilities } from "../../src/features/run/client/device-feedback";

export interface CapabilityNoticeItem {
  id: "audio" | "haptics" | "wakeLock";
  message: string;
}

export function buildCapabilityNotices(
  capabilities: DeviceFeedbackCapabilities,
): CapabilityNoticeItem[] {
  const notices: CapabilityNoticeItem[] = [];

  if (capabilities.audio.state !== "ready") {
    notices.push({
      id: "audio",
      message:
        capabilities.audio.reason ??
        "Audio cues are unavailable for this run.",
    });
  }

  if (capabilities.haptics.state !== "ready") {
    notices.push({
      id: "haptics",
      message:
        capabilities.haptics.reason ??
        "Haptics are unavailable for this run.",
    });
  }

  if (capabilities.wakeLock.state !== "ready") {
    notices.push({
      id: "wakeLock",
      message:
        capabilities.wakeLock.reason ??
        "Wake lock is unavailable for this run.",
    });
  }

  return notices;
}

export function RunCapabilityNotice({
  capabilities,
}: {
  capabilities: DeviceFeedbackCapabilities;
}) {
  const notices = buildCapabilityNotices(capabilities);

  if (notices.length === 0) {
    return null;
  }

  return (
    <aside
      data-testid="run-capability-notice"
      aria-live="polite"
      style={{
        display: "grid",
        gap: "0.45rem",
        borderRadius: "0.9rem",
        padding: "0.65rem 0.75rem",
        backgroundColor: "rgba(255, 215, 166, 0.12)",
        border: "1px solid rgba(255, 215, 166, 0.28)",
      }}
    >
      {notices.map((notice) => (
        <p
          key={notice.id}
          data-testid={`run-capability-notice-${notice.id}`}
          style={{
            margin: 0,
            color: "#fff3e6",
            fontWeight: 600,
            fontSize: "0.92rem",
          }}
        >
          {notice.message}
        </p>
      ))}
    </aside>
  );
}
