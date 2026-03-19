import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  fullyParallel: false,
  testDir: "./tests/e2e",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3110",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command:
      "CMS_FORCE_DEMO_MODE=1 npm run build && CMS_FORCE_DEMO_MODE=1 npm run start -- --hostname 127.0.0.1 --port 3110",
    port: 3110,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
