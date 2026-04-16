import { expect, test } from "@playwright/test";

test.describe("auth-session", () => {
  test("keeps guests unblocked on the home route", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("auth-status")).toHaveText("Guest");
    await expect(page.getByTestId("google-sign-in-button")).toBeVisible();
  });

  test("restores the signed-in shell state after the callback redirect and refresh", async ({
    page,
    baseURL,
  }) => {
    const callbackResponse = await page.request.get(
      "/auth/callback?mock_user_id=user-42&mock_email=rita@example.com&mock_name=Rita%20Jones&next=/",
      {
        maxRedirects: 0,
      },
    );

    expect(callbackResponse.status()).toBe(307);

    const setCookie = callbackResponse.headers()["set-cookie"];
    const redirectLocation = callbackResponse.headers()["location"];
    const authCookieMatch = setCookie?.match(
      /ndft-auth-test-session=([^;]+);/i,
    );

    expect(setCookie).toContain("ndft-auth-test-session=");
    expect(redirectLocation).toMatch(/\/$/);
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

    await page.goto(redirectUrl.toString());

    await expect(page.getByTestId("auth-status")).toHaveText("Signed In");
    await expect(page.getByTestId("profile-chip")).toHaveText("Rita");

    await page.reload();

    await expect(page.getByTestId("auth-status")).toHaveText("Signed In");
    await expect(page.getByTestId("profile-chip")).toHaveText("Rita");
  });
});
