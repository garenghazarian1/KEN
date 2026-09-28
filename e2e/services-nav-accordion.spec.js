import { expect, test } from "@playwright/test";

test("phone Services opens a lookbook sheet", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const accept = page.getByRole("button", { name: "Accept all cookies" });
  if (await accept.isVisible().catch(() => false)) await accept.click();

  await page.getByRole("button", { name: "Services" }).click();

  const dialog = page.getByRole("dialog", { name: "Browse services" });
  await expect(dialog).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("button", { name: "Go back" })).toHaveCount(0);
  await expect(dialog.getByRole("heading", { name: "Services" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "View services" })).toBeVisible();

  const categories = dialog.getByRole("list", { name: "Service categories" });
  await expect(categories).toBeVisible();
  const firstCategory = categories.getByRole("button").first();
  await expect(firstCategory).toHaveAttribute("aria-current", "true");

  const subList = dialog.getByRole("list", { name: "Subcategories" });
  const firstSub = subList.getByRole("button").first();
  await expect(firstSub).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.getByRole("link", { name: "View all" }).first()).toBeVisible();
  const secondSub = subList.getByRole("button").nth(1);
  await secondSub.click();
  await expect(secondSub).toHaveAttribute("aria-expanded", "true");
  await expect(firstSub).toHaveAttribute("aria-expanded", "false");
  await expect(dialog.getByText(/AED/)).toHaveCount(0);
  await expect(page).toHaveURL(/\/$/);

  const serviceLink = subList
    .locator('li:has(> button[aria-expanded="true"]) a[href*="service="]')
    .first();
  await expect(serviceLink).toBeVisible();
  const serviceName = (await serviceLink.textContent()).trim();
  await serviceLink.click();
  await expect(page).toHaveURL(/[?&]service=/);
  const opened = page.getByRole("button", { name: serviceName, exact: true });
  await expect(opened).toHaveAttribute("aria-expanded", "true");
  await expect(opened).toBeInViewport();
});

test("desktop Services opens a lookbook panel", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const accept = page.getByRole("button", { name: "Accept all cookies" });
  if (await accept.isVisible().catch(() => false)) await accept.click();

  await page.getByRole("button", { name: "Services" }).click();

  const dialog = page.getByRole("dialog", { name: "Browse services" });
  await expect(dialog).toBeVisible({ timeout: 20_000 });
  await expect(dialog.getByRole("list", { name: "Service categories" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "View services" })).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Services" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Go back" })).toHaveCount(0);
  await expect(page).toHaveURL(/\/$/);

  const serviceLink = dialog.locator('a[href*="service="]').first();
  await expect(serviceLink).toBeVisible();
  const serviceName = (await serviceLink.textContent()).trim();
  await serviceLink.click();
  await expect(page).toHaveURL(/[?&]service=/);
  const pressed = page.locator('button[aria-pressed="true"]');
  await expect(pressed).toHaveCount(1);
  await expect(pressed).toContainText(serviceName);
  await expect(pressed).toBeInViewport();
});
