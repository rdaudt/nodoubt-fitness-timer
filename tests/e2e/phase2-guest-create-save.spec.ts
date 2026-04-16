import { expect, test } from "@playwright/test";

test.describe("phase2-guest-create-save", () => {
  test("guest can create temporary timers and dismiss save prompts without blocking", async ({
    page,
  }) => {
    await page.goto("/create");

    await expect(page.getByTestId("create-entry-screen")).toBeVisible();
    await expect(page.getByTestId("create-entry-auth-status")).toHaveText(
      "Guest",
    );

    await page.getByTestId("create-option-hiit").click();
    await expect(page.getByTestId("quick-create-form")).toBeVisible();
    await expect(page.getByTestId("quick-create-auth-status")).toHaveText("Guest");

    await page.getByTestId("quick-create-submit").click();
    await expect(page).toHaveURL(/\/create\/custom\?/);
    await expect(page.getByTestId("custom-create-editor")).toBeVisible();
    await expect(page.getByTestId("guest-temp-status")).toContainText(
      "Guest Temporary Draft",
    );
    await expect(page.getByTestId("custom-create-notice")).toContainText(
      "Guest drafts stay temporary until you sign in and save.",
    );

    await page.getByTestId("guest-save-permanent").click();
    await expect(page.getByTestId("save-prompt-modal")).toBeVisible();
    await page.getByTestId("save-prompt-keep-editing").click();
    await expect(page.getByTestId("save-prompt-modal")).toHaveCount(0);

    await page.getByTestId("guest-leave-create").click();
    await expect(page.getByTestId("save-prompt-modal")).toBeVisible();
    await page.getByTestId("leave-prompt-keep-editing").click();
    await expect(page.getByTestId("save-prompt-modal")).toHaveCount(0);

    await page.getByTestId("guest-leave-create").click();
    await page.getByTestId("leave-prompt-discard").click();
    await expect(page).toHaveURL(/\/create$/);
    await expect(page.getByTestId("create-entry-screen")).toBeVisible();
  });
});
