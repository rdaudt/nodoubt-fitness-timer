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

async function jumpUntilComplete(page: Page) {
  const runAgainButton = page.getByRole("button", { name: "Run again" });

  for (let index = 0; index < 30; index += 1) {
    if (await runAgainButton.count()) {
      return;
    }

    const nextButton = page.getByTestId("run-control-next");

    if (!(await nextButton.count())) {
      await expect(runAgainButton).toBeVisible();
      return;
    }

    await nextButton.click({ timeout: 1000 }).catch(() => undefined);
  }
}

test.describe("phase3-run-controls", () => {
  test("run mode supports home/library entry, controls, and completion flow", async ({
    page,
    baseURL,
  }) => {
    await signInWithMockSession(baseURL, page);

    await page.goto("/");
    await expect(page.getByTestId("home-screen")).toBeVisible();

    await page.getByTestId("home-run-now-timer-monday-burn").click();
    await expect(page).toHaveURL(/\/run\?timerId=timer-monday-burn/);
    await expect(page.getByTestId("run-screen")).toBeVisible();
    await page.getByTestId("run-control-exit").click();
    await expect(page.getByTestId("run-exit-confirm")).toBeVisible();
    await page.getByTestId("run-control-exit-cancel").click();

    await page.getByTestId("run-control-lock").click();
    await expect(page.getByTestId("run-control-next")).toBeDisabled();
    await page.getByTestId("run-control-unlock").click();

    await page.getByTestId("run-control-pause").click();
    await expect(page.getByTestId("run-control-resume")).toBeVisible();
    await page.getByTestId("run-control-resume").click();

    await page.getByTestId("run-control-reset").click();
    await expect(page.getByTestId("run-reset-confirm")).toBeVisible();
    await page.getByTestId("run-control-reset-cancel").click();
    await page.getByTestId("run-control-reset").click();
    await page.getByTestId("run-control-reset-confirm").click();
    await expect(page.getByTestId("run-control-resume")).toBeVisible();

    await page.goto("/library");
    await expect(page.getByTestId("library-screen")).toBeVisible();
    await page.getByTestId("library-run-now-timer-monday-burn").click();
    await expect(page).toHaveURL(/\/run\?timerId=timer-monday-burn/);

    await page.goto("/templates/starter-hiit-18");
    await expect(page.getByTestId("timer-detail-screen")).toBeVisible();
    await page.getByTestId("template-run-now").click();
    await expect(page).toHaveURL(/\/run\?templateSlug=starter-hiit-18/);

    await jumpUntilComplete(page);
    await expect(page.getByRole("button", { name: "Run again" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Starter HIIT 18");

    await page.getByTestId("run-completion-run-again").click();
    await expect(page.getByTestId("run-screen")).toBeVisible();

    await jumpUntilComplete(page);
    await page.getByTestId("run-completion-home").click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("home-screen")).toBeVisible();
  });

  test("active run can be exited before completion", async ({ page, baseURL }) => {
    await signInWithMockSession(baseURL, page);

    await page.goto("/");
    await expect(page.getByTestId("home-screen")).toBeVisible();
    await page.getByTestId("home-run-now-timer-monday-burn").click();
    await expect(page).toHaveURL(/\/run\?timerId=timer-monday-burn/);
    await expect(page.getByTestId("run-screen")).toBeVisible();

    await page.getByTestId("run-control-exit").click();
    await expect(page.getByTestId("run-exit-confirm")).toBeVisible();
    await page.getByTestId("run-control-exit-confirm").click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId("home-screen")).toBeVisible();
  });
});
