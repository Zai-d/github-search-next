import { test, expect } from "@playwright/test";

test("search users and infinite scroll", async ({ page, context }) => {
  const hasToken = !!process.env.GITHUB_TOKEN;
  if (!hasToken) {
    await context.route("**/api/github/search/users**", async (route) => {
      const json = require("./fixtures/users.vercel.json");
      await route.fulfill({ status: 200, body: JSON.stringify(json) });
    });
    await context.route("**/api/github/users/**", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          name: "Vercel",
          login: "vercel",
          html_url: "https://github.com/vercel",
          avatar_url: "",
        }),
      });
    });
  }

  await page.goto("/");

  await page.getByRole("button", { name: "Users" }).click();

  const input = page.getByLabel("Search input");
  await input.fill("vercel");

  await page.waitForTimeout(600);

  await expect(
    page.getByRole("link", { name: /vercel/i }).first()
  ).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await page.waitForTimeout(500);
});
