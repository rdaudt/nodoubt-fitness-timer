import { expect, test, type Page } from "@playwright/test";

async function signInWithMockSession(baseURL: string | undefined, page: Page) {
  const callbackResponse = await page.request.get(
    "/auth/callback?mock_user_id=user-42&mock_email=rita@example.com&mock_name=Rita%20Jones&next=/",
    {
      maxRedirects: 0,
    },
  );

  expect(callbackResponse.status()).toBe(307);

  const redirectLocation = callbackResponse.headers()["location"];
  const setCookie = callbackResponse.headers()["set-cookie"];
  const authCookieMatch = setCookie?.match(/ndft-auth-test-session=([^;]+);/i);

  expect(authCookieMatch?.[1]).toBeTruthy();

  const redirectUrl = new URL(
    redirectLocation ?? "/",
    baseURL ?? "http://127.0.0.1:3000",
  );

  await page.context().addCookies([
    {
      name: "ndft-auth-test-session",
      value: authCookieMatch![1],
      url: redirectUrl.origin,
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}

test.describe("phase3-device-feedback", () => {
  test("shows explicit fallback notices when device APIs are blocked or unsupported", async ({
    page,
    baseURL,
  }) => {
    await page.addInitScript(() => {
      class BlockedAudioContext {
        state = "suspended";
        currentTime = 0;
        destination = {};

        resume() {
          return Promise.reject(new Error("autoplay blocked"));
        }

        close() {
          return Promise.resolve();
        }

        createOscillator() {
          return {
            type: "sine",
            frequency: { value: 0 },
            connect: () => undefined,
            start: () => undefined,
            stop: () => undefined,
          };
        }

        createGain() {
          return {
            gain: {
              setValueAtTime: () => undefined,
              linearRampToValueAtTime: () => undefined,
            },
            connect: () => undefined,
          };
        }
      }

      Object.defineProperty(window, "AudioContext", {
        configurable: true,
        value: BlockedAudioContext,
      });
      Object.defineProperty(navigator, "vibrate", {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(navigator, "wakeLock", {
        configurable: true,
        value: undefined,
      });
    });

    await signInWithMockSession(baseURL, page);
    await page.goto("/run?timerId=timer-monday-burn");

    await expect(page.getByTestId("run-capability-notice")).toBeVisible();
    await expect(page.getByTestId("run-capability-notice-audio")).toContainText(
      /audio/i,
    );
    await expect(page.getByTestId("run-capability-notice-haptics")).toContainText(
      "Haptics are unavailable",
    );
    await expect(page.getByTestId("run-capability-notice-wakeLock")).toContainText(
      "Wake lock is unavailable",
    );

    await page.getByTestId("run-control-next").click();
    await page.getByTestId("run-control-pause").click();
    await expect(page.getByTestId("run-control-resume")).toBeVisible();
    await expect(page.getByTestId("run-screen")).toBeVisible();
  });

  test("clears fallback notices after user interaction when capabilities are available", async ({
    page,
    baseURL,
  }) => {
    await page.addInitScript(() => {
      class ReadyAudioContext {
        state = "suspended";
        currentTime = 0;
        destination = {};

        resume() {
          this.state = "running";
          return Promise.resolve();
        }

        close() {
          return Promise.resolve();
        }

        createOscillator() {
          return {
            type: "sine",
            frequency: { value: 0 },
            connect: () => undefined,
            start: () => undefined,
            stop: () => undefined,
          };
        }

        createGain() {
          return {
            gain: {
              setValueAtTime: () => undefined,
              linearRampToValueAtTime: () => undefined,
            },
            connect: () => undefined,
          };
        }
      }

      Object.defineProperty(window, "AudioContext", {
        configurable: true,
        value: ReadyAudioContext,
      });
      Object.defineProperty(navigator, "vibrate", {
        configurable: true,
        value: () => true,
      });
      Object.defineProperty(navigator, "wakeLock", {
        configurable: true,
        value: {
          request: async () => ({
            released: false,
            release: async () => undefined,
          }),
        },
      });
    });

    await signInWithMockSession(baseURL, page);
    await page.goto("/run?timerId=timer-monday-burn");

    await expect(page.getByTestId("run-capability-notice")).toBeVisible();
    await page.getByTestId("run-title").click();
    await expect(page.getByTestId("run-capability-notice")).toBeHidden();
  });
});
