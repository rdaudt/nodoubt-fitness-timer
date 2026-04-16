import { expect, test, type Page } from "@playwright/test";

async function signInWithMockSession(baseURL: string | undefined, page: Page) {
  const callbackResponse = await page.request.get(
    "/auth/callback?mock_user_id=user-42&mock_email=rita@example.com&mock_name=Rita%20Jones&next=/timers/timer-monday-burn/edit",
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

test.describe("phase2-editor-drafts", () => {
  test("signed-in edits autosave and reappear on timer detail", async ({
    page,
    baseURL,
  }) => {
    await signInWithMockSession(baseURL, page);
    await page.goto("/timers/timer-monday-burn/edit");

    const notFoundHeading = page.getByRole("heading", { name: "404" });

    if (await notFoundHeading.isVisible({ timeout: 1000 }).catch(() => false)) {
      await page.goto("/timers/timer-monday-burn/edit");
    }

    await expect(page.getByTestId("timer-editor-screen")).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByTestId("editor-auth-status")).toHaveText("Signed In");

    await page.getByTestId("editor-name-input").fill("Monday Burn Autosaved");
    await page.getByTestId("editor-rounds-input").fill("2");

    await expect(page.getByTestId("editor-autosave-status")).toContainText(
      "Draft saved",
      { timeout: 15000 },
    );

    await page.goto("/timers/timer-monday-burn");
    await expect(page.getByTestId("timer-detail-screen")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Monday Burn Autosaved",
    );

    await page.goto("/library");
    await expect(page.getByTestId("library-card-timer-monday-burn")).toBeVisible();
    await expect(page.getByTestId("library-draft-timer-monday-burn")).toHaveText(
      "Draft",
    );
  });
});
