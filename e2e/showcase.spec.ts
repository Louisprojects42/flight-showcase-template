import { test, expect } from "@playwright/test";
test("desktop film scrolls and has no browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Your idea. In motion." })).toBeVisible();
  await expect(page.locator(".film-stage")).toHaveAttribute("data-live", "true");
  const start = await page.locator(".film-track").evaluate(track => track.getBoundingClientRect().top + window.scrollY);
  const span = await page.locator(".film-track").evaluate(track => track.clientHeight - window.innerHeight);
  await page.evaluate(({ start, span }) => window.scrollTo(0, start + span * .55), { start, span });
  await expect(page.getByRole("heading", { name: "Show the work. Keep the focus." })).toBeVisible();
  await expect(page.locator("[data-scene-position]")).toHaveText("55 %");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
test("mobile navigation, placeholders and theme work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".stacked-poster").first()).toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Docs" }).click();
  await expect(page.getByRole("heading", { name: "Documentation, to come." })).toBeVisible();
  await page.getByRole("link", { name: "Open getting started" }).click();
  await expect(page.getByRole("heading", { name: "Getting started, to come." })).toBeVisible();
  await page.getByRole("button", { name: "Use light theme" }).click();
  await expect(page.locator("html")).toHaveClass(/light/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("reduced motion, opt-out and no-JavaScript retain the content", async ({ browser, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".stacked-poster").first()).toBeVisible();
  expect(await page.locator(".film-stage").evaluate(e => getComputedStyle(e).position)).not.toBe("sticky");
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const staticPage = await context.newPage();
  await staticPage.goto("/");
  await expect(staticPage.getByRole("heading", { name: "Your idea. In motion." })).toBeVisible();
  await expect(staticPage.locator(".stacked-poster").first()).toBeVisible();
  await context.close();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Reduce motion" }).click();
  await expect(page.locator("html")).toHaveClass(/film-off/);
  await page.reload();
  await expect(page.locator(".stacked-poster").first()).toBeVisible();
});
test("all placeholder pages resolve and removed routes return 404", async ({ request }) => {
  for (const route of ["/capabilities","/workspace","/docs","/pricing","/contact","/legal","/docs/getting-started","/docs/guides","/docs/reference"]) {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("Placeholder content");
  }
  for (const route of ["/simulate","/api/simulate","/signin","/account","/model-card"]) expect((await request.get(route)).status()).toBe(404);
});
