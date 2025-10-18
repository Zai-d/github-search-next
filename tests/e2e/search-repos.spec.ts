import { test, expect } from "@playwright/test";

test("search repositories and lazy details", async ({ page, context }) => {
  const hasToken = !!process.env.GITHUB_TOKEN;
  if (!hasToken) {
    await context.route(
      "**/api/github/search/repositories**",
      async (route) => {
        const json = require("./fixtures/repos.react.json");
        await route.fulfill({ status: 200, body: JSON.stringify(json) });
      }
    );
    await context.route("**/api/github/repos/**/languages", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ TypeScript: 100, JavaScript: 50 }),
      });
    });
    await context.route("**/api/github/repos/**/forks**", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            html_url: "https://github.com/user1/react",
            owner: { login: "user1", avatar_url: "https://example.com/a.png" },
          },
        ]),
      });
    });
    await context.route("**/api/github/repos/**/topics", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ names: ["library", "frontend"] }),
      });
    });
  }

  await page.goto("/");

  const input = page.getByLabel("Search input");
  await input.fill("react");
  await page.waitForTimeout(600);

  await expect(
    page.getByRole("link", { name: /facebook\/react/i })
  ).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);

  await expect(page.getByTitle(/Stars/i).first()).toBeVisible();
});
