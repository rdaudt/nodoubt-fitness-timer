export const PLAYBACK_DEFAULTS = {
  finalCountdownSeconds: [3, 2, 1],
  audio: {
    transitionHz: 880,
    finalCountdownHz: 1320,
    cueDurationMs: 120,
    volume: 0.06,
  },
  haptics: {
    transitionPattern: [25],
    finalCountdownPattern: [15, 30, 15],
  },
  wakeLock: {
    enabled: true,
    type: "screen" as const,
  },
} as const;
