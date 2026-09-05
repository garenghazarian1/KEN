import { expect, test } from "@playwright/test";

test(" /services loads a multi-linked catalog without MiniSearch duplicate errors", async ({
  page,
}) => {
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.goto("/services");
  const search = page.getByRole("combobox", { name: "Search services" });
  await expect(search).toBeVisible({ timeout: 20_000 });

  const duplicate = pageErrors.find((msg) => /MiniSearch: duplicate ID/i.test(msg));
  expect(duplicate, pageErrors.join("\n")).toBeUndefined();

  const accept = page.getByRole("button", { name: "Accept all cookies" });
  if (await accept.isVisible()) await accept.click();

  await search.fill("Feet Treatment");
  await expect(page.getByRole("list", { name: "Search results" })).toBeVisible();
  await expect(page.getByText("Feet Treatment").first()).toBeVisible();
});
