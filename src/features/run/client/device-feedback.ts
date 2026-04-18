import type { RunPlaybackStatus } from "../contracts/run-session";
import { PLAYBACK_DEFAULTS } from "../contracts/playback-defaults";

type CapabilityState = "ready" | "blocked" | "unsupported";

export interface DeviceCapabilityStatus {
  state: CapabilityState;
  reason: string | null;
}

export interface DeviceFeedbackCapabilities {
  audio: DeviceCapabilityStatus;
  haptics: DeviceCapabilityStatus;
  wakeLock: DeviceCapabilityStatus;
}

interface AudioContextLike {
  state?: string;
  currentTime?: number;
  destination?: AudioNode;
  resume?: () => Promise<void>;
  close?: () => Promise<void>;
  createOscillator?: () => OscillatorNode;
  createGain?: () => GainNode;
}

interface WakeLockSentinelLike {
  released?: boolean;
  release?: () => Promise<void>;
}

interface WakeLockLike {
  request: (type: "screen") => Promise<WakeLockSentinelLike>;
}

interface DeviceFeedbackEnvironment {
  AudioContext?: new (...args: any[]) => AudioContextLike;
  webkitAudioContext?: new (...args: any[]) => AudioContextLike;
  navigator?: Navigator & {
    wakeLock?: WakeLockLike;
  };
}

function defaultEnvironment(): DeviceFeedbackEnvironment {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {};
  }

  return {
    AudioContext: window.AudioContext,
    webkitAudioContext: (
      window as Window & {
        webkitAudioContext?: new (...args: any[]) => AudioContextLike;
      }
    )
      .webkitAudioContext,
    navigator,
  };
}

function blocked(reason: string): DeviceCapabilityStatus {
  return { state: "blocked", reason };
}

function unsupported(reason: string): DeviceCapabilityStatus {
  return { state: "unsupported", reason };
}

function ready(): DeviceCapabilityStatus {
  return { state: "ready", reason: null };
}

export interface DeviceFeedbackController {
  getCapabilities: () => DeviceFeedbackCapabilities;
  primeFromUserInteraction: () => Promise<void>;
  emitTransitionCue: () => void;
  emitFinalCountdownCue: (secondsRemaining: number) => void;
  syncPlaybackStatus: (status: RunPlaybackStatus) => Promise<void>;
  stop: () => Promise<void>;
}

export function createDeviceFeedbackController(
  providedEnvironment?: DeviceFeedbackEnvironment,
): DeviceFeedbackController {
  const environment = providedEnvironment ?? defaultEnvironment();
  const AudioContextCtor =
    environment.AudioContext ?? environment.webkitAudioContext ?? null;

  let capabilities: DeviceFeedbackCapabilities = {
    audio: AudioContextCtor ? blocked("Tap once to enable audio cues.") : unsupported("Audio cues are unavailable on this browser."),
    haptics:
      typeof environment.navigator?.vibrate === "function"
        ? ready()
        : unsupported("Haptics are unavailable on this device."),
    wakeLock:
      PLAYBACK_DEFAULTS.wakeLock.enabled &&
      typeof environment.navigator?.wakeLock?.request === "function"
        ? ready()
        : unsupported("Wake lock is unavailable; keep this screen awake manually."),
  };

  let audioContext: AudioContextLike | null = null;
  let wakeLockSentinel: WakeLockSentinelLike | null = null;

  const ensureAudioContext = () => {
    if (!AudioContextCtor || audioContext) {
      return;
    }

    try {
      audioContext = new AudioContextCtor();
    } catch {
      capabilities = {
        ...capabilities,
        audio: unsupported("Audio cues are unavailable on this browser."),
      };
    }
  };

  const playTone = (frequencyHz: number) => {
    if (!audioContext || capabilities.audio.state !== "ready") {
      return;
    }

    if (!audioContext.createOscillator || !audioContext.createGain || !audioContext.destination) {
      return;
    }

    try {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime ?? 0;
      const stopAt = now + PLAYBACK_DEFAULTS.audio.cueDurationMs / 1_000;

      oscillator.type = "sine";
      oscillator.frequency.value = frequencyHz;
      gain.gain.setValueAtTime(PLAYBACK_DEFAULTS.audio.volume, now);
      gain.gain.linearRampToValueAtTime(0.0001, stopAt);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(stopAt);
    } catch {
      capabilities = {
        ...capabilities,
        audio: blocked("Audio cues are blocked until browser playback is allowed."),
      };
    }
  };

  const vibrate = (
    pattern: Parameters<NonNullable<Navigator["vibrate"]>>[0],
  ) => {
    if (capabilities.haptics.state !== "ready") {
      return;
    }

    try {
      environment.navigator?.vibrate?.(pattern);
    } catch {
      capabilities = {
        ...capabilities,
        haptics: unsupported("Haptics are unavailable on this device."),
      };
    }
  };

  const releaseWakeLock = async () => {
    if (!wakeLockSentinel) {
      return;
    }

    const sentinel = wakeLockSentinel;
    wakeLockSentinel = null;

    try {
      if (!sentinel.released) {
        await sentinel.release?.();
      }
    } catch {
      // Ignore wake lock release failures; timing should never depend on device APIs.
    }
  };

  const requestWakeLock = async () => {
    if (capabilities.wakeLock.state !== "ready" || wakeLockSentinel) {
      return;
    }

    try {
      wakeLockSentinel = await environment.navigator?.wakeLock?.request(
        PLAYBACK_DEFAULTS.wakeLock.type,
      ) ?? null;
    } catch {
      capabilities = {
        ...capabilities,
        wakeLock: blocked("Wake lock was denied. Keep the screen active manually."),
      };
    }
  };

  return {
    getCapabilities: () => capabilities,
    primeFromUserInteraction: async () => {
      ensureAudioContext();

      if (!audioContext) {
        return;
      }

      try {
        await audioContext.resume?.();
        capabilities = {
          ...capabilities,
          audio: ready(),
        };
      } catch {
        capabilities = {
          ...capabilities,
          audio: blocked("Audio cues are blocked until browser playback is allowed."),
        };
      }
    },
    emitTransitionCue: () => {
      playTone(PLAYBACK_DEFAULTS.audio.transitionHz);
      vibrate(PLAYBACK_DEFAULTS.haptics.transitionPattern);
    },
    emitFinalCountdownCue: (secondsRemaining: number) => {
      if (
        !PLAYBACK_DEFAULTS.finalCountdownSeconds.some(
          (value) => value === secondsRemaining,
        )
      ) {
        return;
      }

      playTone(PLAYBACK_DEFAULTS.audio.finalCountdownHz);
      vibrate(PLAYBACK_DEFAULTS.haptics.finalCountdownPattern);
    },
    syncPlaybackStatus: async (status) => {
      if (status === "running") {
        await requestWakeLock();
        return;
      }

      await releaseWakeLock();
    },
    stop: async () => {
      await releaseWakeLock();
      await audioContext?.close?.();
      audioContext = null;
    },
  };
}
