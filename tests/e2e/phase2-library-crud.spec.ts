import { expect, test, type Page } from "@playwright/test";

async function signInWithMockSession(baseURL: string | undefined, page: Page) {
  const callbackResponse = await page.request.get(
    "/auth/callback?mock_user_id=user-42&mock_email=rita@example.com&mock_name=Rita%20Jones&next=/library",
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
    redirectLocation ?? "/library",
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

test.describe("phase2-library-crud", () => {
  test("signed-in users can browse library, duplicate templates, and manage personal timer details", async ({
    page,
    baseURL,
  }) => {
    await signInWithMockSession(baseURL, page);
    await page.goto("/library");

    await expect(page.getByTestId("library-screen")).toBeVisible();
    await expect(page.getByTestId("library-auth-status")).toHaveText("Signed In");
    await expect(page.getByTestId("library-card-timer-monday-burn")).toBeVisible();
    await expect(page.getByTestId("library-draft-timer-mobility-reset")).toHaveText(
      "Draft",
    );

    await page.getByTestId("library-duplicate-timer-monday-burn").click();
    await expect(page.getByTestId("library-notice")).toContainText(
      "Timer duplicated into a new draft.",
    );

    await page.getByTestId("library-delete-timer-sprint-ladder").click();
    await expect(page.getByTestId("library-notice")).toContainText(
      "Timer deleted from your library.",
    );
    await expect(page.getByTestId("library-card-timer-sprint-ladder")).toHaveCount(
      0,
    );

    await page.goto("/timers/timer-monday-burn");
    await expect(page.getByTestId("timer-detail-screen")).toBeVisible();
    await expect(page.getByTestId("detail-auth-status")).toHaveText("Signed In");
    await expect(page.getByTestId("rename-timer-input")).toBeVisible();
    await expect(page.getByTestId("detail-interval-warmup")).toBeVisible();

    await page.getByTestId("rename-timer-input").fill("Monday Burn Updated");
    await page.getByTestId("rename-timer-submit").click();
    await expect(page.getByTestId("detail-notice")).toContainText(
      "Timer renamed successfully.",
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Monday Burn Updated",
    );

    await page.goto("/templates/starter-hiit-18");
    await expect(page.getByTestId("timer-detail-screen")).toBeVisible();
    await expect(page.getByTestId("detail-primary-badge")).toHaveText(
      "Duplicate before edit",
    );

    await page.getByRole("button", { name: "Duplicate" }).click();
    await expect(page).toHaveURL(/\/timers\/timer-/);
    await expect(page.getByTestId("detail-primary-badge")).toHaveText("Draft");
    await expect(page.getByTestId("detail-notice")).toContainText(
      "Copied into your library as a private draft.",
    );
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Starter HIIT 18 Copy",
    );
  });
});
