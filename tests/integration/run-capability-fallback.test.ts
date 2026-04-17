import { describe, expect, it } from "vitest";

import { buildCapabilityNotices } from "../../components/run/run-capability-notice";

describe("run-capability-fallback", () => {
  it("returns no fallback notices when all device capabilities are ready", () => {
    const notices = buildCapabilityNotices({
      audio: { state: "ready", reason: null },
      haptics: { state: "ready", reason: null },
      wakeLock: { state: "ready", reason: null },
    });

    expect(notices).toHaveLength(0);
  });

  it("surfaces blocked and unsupported fallback reasons without hiding controls", () => {
    const notices = buildCapabilityNotices({
      audio: { state: "blocked", reason: "Tap once to enable audio cues." },
      haptics: {
        state: "unsupported",
        reason: "Haptics are unavailable on this device.",
      },
      wakeLock: {
        state: "unsupported",
        reason: "Wake lock is unavailable; keep this screen awake manually.",
      },
    });

    expect(notices).toEqual([
      {
        id: "audio",
        message: "Tap once to enable audio cues.",
      },
      {
        id: "haptics",
        message: "Haptics are unavailable on this device.",
      },
      {
        id: "wakeLock",
        message: "Wake lock is unavailable; keep this screen awake manually.",
      },
    ]);
  });
});
