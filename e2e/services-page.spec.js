import { expect, test } from "@playwright/test";

async function acceptCookies(page) {
  const accept = page.getByRole("button", { name: "Accept all cookies" });
  try {
    await accept.waitFor({ state: "visible", timeout: 4000 });
    await accept.click();
  } catch {
    // Banner already dismissed.
  }
}

test("desktop services page is one priced lookbook", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/services");
  await acceptCookies(page);

  await expect(page.getByRole("button", { name: "Horizontal" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Vertical" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Grid" })).toHaveCount(0);

  const categories = page.getByRole("list", { name: "Service categories" });
  await expect(categories).toBeVisible({ timeout: 20_000 });
  await expect(categories.getByRole("button").first()).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible();
  await expect(page.getByText(/AED/).first()).toBeVisible();
  expect(await page.getByText(/AED/).count()).toBeGreaterThan(4);
  const preview = page.locator('img[sizes="40vw"]');
  await expect(preview).toHaveCount(1);
  const categorySrc = await preview.getAttribute("src");
  await page.getByRole("heading", { level: 3, name: "Hair Color" }).hover();
  await expect.poll(async () => preview.getAttribute("src")).not.toBe(categorySrc);
  await page.getByRole("button", { name: /Ken Haircut/ }).hover();
  await expect.poll(async () => preview.getAttribute("src")).toBe(categorySrc);
  await page.getByRole("button", { name: /Ken Haircut/ }).click();
  await expect.poll(async () => preview.getAttribute("src")).not.toBe(categorySrc);
  await categories.getByRole("button").first().hover();
  await expect.poll(async () => preview.getAttribute("src")).toBe(categorySrc);
});

test("phone services page opens one service at a time", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/services");
  await acceptCookies(page);

  const categories = page.getByRole("list", { name: "Service categories" });
  await expect(categories).toBeVisible({ timeout: 20_000 });
  const photo = page.locator('img[sizes="100vw"]');
  await expect(photo).toHaveCount(1);

  const groups = page.locator('[id^="service-subcategory-"]');
  const openToggle = groups.first().locator("> button");
  await expect(openToggle).toHaveAttribute("aria-expanded", "true");
  const openName = (await openToggle.textContent()).trim();
  const nextGroup = groups.nth(1);
  const nextToggle = nextGroup.locator("> button");
  const nextName = (await nextToggle.textContent()).trim();
  await nextToggle.click();
  await expect(
    page.getByRole("button", { name: nextName, exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("button", { name: openName, exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(photo).toHaveCount(1);

  const service = nextGroup.getByRole("button").nth(1);
  await expect(service).not.toContainText("AED");
  await service.click();
  await expect(service).toHaveAttribute("aria-expanded", "true");
  await expect(nextGroup.getByText(/AED/).locator("visible=true").first()).toBeVisible();
  await expect(photo).toHaveCount(2);

  const other = nextGroup.getByRole("button").nth(2);
  await other.click();
  await expect(service).toHaveAttribute("aria-expanded", "false");
  await expect(other).toHaveAttribute("aria-expanded", "true");
  await expect(photo).toHaveCount(2);

  await other.click();
  await expect(other).toHaveAttribute("aria-expanded", "false");
  await expect(photo).toHaveCount(1);
});

test("menu link opens the priced category", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await acceptCookies(page);

  await page.getByRole("button", { name: "Services" }).click();
  const dialog = page.getByRole("dialog", { name: "Browse services" });
  await expect(dialog).toBeVisible({ timeout: 20_000 });
  await dialog.getByRole("link", { name: "View services" }).click();

  await expect(page).toHaveURL(/\/services\?/);
  await expect(page.getByText(/AED/).first()).toBeVisible();
  await expect(page.locator('img[sizes="40vw"]')).toHaveCount(1);
});
