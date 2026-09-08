import { expect, test } from "@playwright/test";

test("top nav Services expands categories in place without a Back control", async ({
  page,
}) => {
  await page.goto("/");

  const accept = page.getByRole("button", { name: "Accept all cookies" });
  if (await accept.isVisible().catch(() => false)) await accept.click();

  await page.getByRole("button", { name: "Services" }).click();

  const dialog = page.getByRole("dialog", { name: "Browse services" });
  await expect(dialog).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("button", { name: "Go back" })).toHaveCount(0);

  const categories = dialog.getByRole("list", { name: "Service categories" });
  await expect(categories).toBeVisible();

  const firstCategory = categories.getByRole("button").first();
  await expect(firstCategory).toHaveAttribute("aria-expanded", "false");
  const categoryName = (await firstCategory.innerText()).split("\n")[0];
  await firstCategory.click();
  await expect(firstCategory).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.getByRole("heading", { name: "Services" })).toBeVisible();
  await expect(firstCategory).toContainText(categoryName);

  const nested = dialog.getByRole("list", { name: /Subcategories|Services/ });
  await expect(nested.first()).toBeVisible();

  const subList = dialog.getByRole("list", { name: "Subcategories" });
  if ((await subList.count()) > 0) {
    const firstSub = subList.getByRole("button").first();
    await firstSub.click();
    await expect(firstSub).toHaveAttribute("aria-expanded", "true");
    await expect(firstCategory).toHaveAttribute("aria-expanded", "true");
  }

  await expect(page).toHaveURL(/\/$/);
});
