import { expect, test } from "@playwright/test";

async function signInWithMockSession(baseURL: string | undefined, page: Parameters<typeof test>[0]["page"]) {
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

async function getSectionOrder(page: Parameters<typeof test>[0]["page"]) {
  return page.locator('[data-testid^="home-section-"]').evaluateAll((elements) =>
    elements
      .map((element) => element.getAttribute("data-testid"))
      .filter((value): value is string => Boolean(value)),
  );
}

test.describe("phase1-home-shell", () => {
  test("guest-home keeps official templates visible inside the shell and hides nav on run", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByTestId("bottom-navigation")).toBeVisible();
    await expect(page.getByTestId("home-section-official-templates")).toBeVisible();
    await expect(page.getByTestId("google-sign-in-button")).toBeVisible();
    await expect(page.getByTestId("profile-chip")).toHaveCount(0);
    await expect(getSectionOrder(page)).resolves.toEqual([
      "home-section-official-templates",
    ]);

    await page.goto("/templates");
    await expect(page.getByTestId("bottom-navigation")).toBeVisible();
    await expect(page.getByTestId("home-section-official-templates")).toBeVisible();

    await page.goto("/run");
    await expect(page.getByTestId("bottom-navigation")).toHaveCount(0);
    await expect(page.getByTestId("run-layout")).toBeVisible();
  });

  test("signed-in-home prioritizes my timers and keeps official templates visible", async ({
    page,
    baseURL,
  }) => {
    await signInWithMockSession(baseURL, page);
    await page.goto("/");

    await expect(page.getByTestId("auth-status")).toHaveText("Signed In");
    await expect(page.getByTestId("profile-chip")).toContainText("Rita");
    await expect(page.getByTestId("signed-in-email")).toHaveText(
      "rita@example.com",
    );
    await expect(page.getByTestId("home-section-my-timers")).toBeVisible();
    await expect(page.getByTestId("home-section-official-templates")).toBeVisible();
    await expect(getSectionOrder(page)).resolves.toEqual([
      "home-section-my-timers",
      "home-section-official-templates",
    ]);

    await page.goto("/templates");
    await expect(page.getByTestId("bottom-navigation")).toBeVisible();
    await expect(page.getByTestId("home-section-official-templates")).toBeVisible();

    await page.goto("/run");
    await expect(page.getByTestId("bottom-navigation")).toHaveCount(0);
    await expect(page.getByTestId("run-layout")).toBeVisible();
  });
});
