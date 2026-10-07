import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "e2e",
  timeout: 60000,
  workers: 1,
  use: { baseURL: "http://localhost:3200", contextOptions: { reducedMotion: "no-preference" }, ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, launchOptions: { channel: process.env.PLAYWRIGHT_CHANNEL, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } },
  webServer: { command: "npm run dev -- --port 3200", url: "http://localhost:3200", reuseExistingServer: true, timeout: 120000 },
});
