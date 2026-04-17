import { describe, expect, it, vi } from "vitest";

import { createDeviceFeedbackController } from "../../src/features/run/client/device-feedback";

function createAudioContextStub(overrides: {
  resume?: () => Promise<void>;
} = {}) {
  return class AudioContextStub {
    state = "suspended";
    currentTime = 0;
    destination = {};

    resume = overrides.resume ?? (() => Promise.resolve());
    close = () => Promise.resolve();

    createOscillator() {
      return {
        type: "sine",
        frequency: { value: 0 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
    }

    createGain() {
      return {
        gain: {
          setValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      };
    }
  };
}

describe("device-feedback", () => {
  it("reports unsupported capabilities when browser APIs are unavailable", () => {
    const controller = createDeviceFeedbackController({
      navigator: {},
    });

    expect(controller.getCapabilities().audio.state).toBe("unsupported");
    expect(controller.getCapabilities().haptics.state).toBe("unsupported");
    expect(controller.getCapabilities().wakeLock.state).toBe("unsupported");
  });

  it("primes audio and dispatches transition/final countdown haptic cues", async () => {
    const vibrate = vi.fn();
    const controller = createDeviceFeedbackController({
      AudioContext: createAudioContextStub(),
      navigator: {
        vibrate,
      },
    });

    expect(controller.getCapabilities().audio.state).toBe("blocked");

    await controller.primeFromUserInteraction();

    expect(controller.getCapabilities().audio.state).toBe("ready");

    controller.emitTransitionCue();
    controller.emitFinalCountdownCue(3);
    controller.emitFinalCountdownCue(9);

    expect(vibrate).toHaveBeenCalledTimes(2);
    expect(vibrate).toHaveBeenNthCalledWith(1, [25]);
    expect(vibrate).toHaveBeenNthCalledWith(2, [15, 30, 15]);
  });

  it("marks wake lock as blocked when browser denies it without breaking flow", async () => {
    const controller = createDeviceFeedbackController({
      AudioContext: createAudioContextStub(),
      navigator: {
        wakeLock: {
          request: vi.fn(async () => {
            throw new Error("Denied");
          }),
        },
      },
    });

    await expect(controller.syncPlaybackStatus("running")).resolves.toBeUndefined();
    expect(controller.getCapabilities().wakeLock.state).toBe("blocked");
  });
});
