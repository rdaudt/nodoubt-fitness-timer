import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  timeout: 30_000,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx next dev --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      AUTH_TEST_MODE: "1",
      NEXT_PUBLIC_NEON_DATA_API_URL: "https://example-data-api.aws.neon.tech/rest/v1",
      NEXT_PUBLIC_NEON_AUTH_URL: "https://example.neonauth.us-east-1.aws.neon.tech",
      NEON_AUTH_BASE_URL: "https://example.neonauth.us-east-1.aws.neon.tech",
      NEON_AUTH_COOKIE_SECRET: "0123456789abcdef0123456789abcdef",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
