import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT || "3000";

export default defineConfig({
  testDir: "./tests/e2e",
  retries: 0,
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    headless: true,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    port: Number(PORT),
    env: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN || "",
    },
  },
});
