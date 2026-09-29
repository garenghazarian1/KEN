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
  await expect(page.getByRole("link", { name: "See how" })).toHaveAttribute(
    "href",
    "/services/how-to-book",
  );
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
  await expect.poll(async () => preview.getAttribute("src")).toBe(categorySrc);
  const haircut = page
    .locator("[data-service-toggle]")
    .filter({ hasText: "Ken Haircut" });
  await haircut.click();
  await expect.poll(async () => preview.getAttribute("src")).not.toBe(categorySrc);
  const longRow = page
    .locator("[data-service-toggle]")
    .filter({ hasText: "Hair Color Correction/Change" });
  const longName = longRow.locator('[class*="serviceName"]');
  const longPrice = longRow.locator('[class*="servicePrice"]');
  const floor = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.fontSize = "var(--font-size-xs)";
    document.body.appendChild(probe);
    const size = parseFloat(getComputedStyle(probe).fontSize);
    probe.remove();
    return size;
  });
  const longNameSize = await longName.evaluate(
    (el) => parseFloat(getComputedStyle(el).fontSize),
  );
  const longPriceSize = await longPrice.evaluate(
    (el) => parseFloat(getComputedStyle(el).fontSize),
  );
  expect(longNameSize).toBeGreaterThanOrEqual(floor - 0.5);
  expect(Math.abs(longNameSize - longPriceSize)).toBeLessThan(0.6);
  const shortRow = page
    .locator("[data-service-toggle]")
    .filter({ hasText: /^Hair Wash/ });
  const shortNameSize = await shortRow
    .locator('[class*="serviceName"]')
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  const shortPriceSize = await shortRow
    .locator('[class*="servicePrice"]')
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(Math.abs(shortNameSize - shortPriceSize)).toBeLessThan(0.6);
  expect(shortNameSize).toBeGreaterThan(longNameSize);
  await categories.getByRole("button").first().hover();
  await expect.poll(async () => preview.getAttribute("src")).toBe(categorySrc);
});

test("phone services page opens one service at a time", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/services");
  await acceptCookies(page);

  const categories = page.getByRole("list", { name: "Service categories" });
  await expect(categories).toBeVisible({ timeout: 20_000 });
  const photo = page.locator('img[sizes="50vw"]');
  await expect(photo).toHaveCount(0);
  const serviceName = page.locator('[class*="serviceName"]').first();
  const nameStyle = await serviceName.evaluate((el) => {
    const style = getComputedStyle(el);
    return { whiteSpace: style.whiteSpace, textOverflow: style.textOverflow };
  });
  expect(nameStyle.whiteSpace).toBe("normal");
  expect(nameStyle.textOverflow).not.toBe("ellipsis");

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
  await expect(photo).toHaveCount(0);
  await expect(nextGroup.locator('[class*="boardFrame"]')).toHaveCount(0);

  const serviceToggles = nextGroup.locator("[data-service-toggle]");
  const service = serviceToggles.nth(0);
  await expect(service).not.toContainText("AED");
  await service.click();
  await expect(service).toHaveAttribute("aria-expanded", "true");
  await expect(nextGroup.getByText(/AED/).locator("visible=true").first()).toBeVisible();
  await expect(photo).toHaveCount(1);
  const frame = nextGroup.locator('[class*="boardFrame"]');
  await expect.poll(async () => {
    const frameBox = await frame.boundingBox();
    const columnBox = await nextGroup.boundingBox();
    if (!frameBox || !columnBox || columnBox.width < 1) return 0;
    const ratio = frameBox.width / columnBox.width;
    const square = Math.abs(frameBox.height - frameBox.width) <= 2;
    return ratio > 0.4 && ratio < 0.55 && square ? 1 : 0;
  }).toBe(1);

  const other = serviceToggles.nth(1);
  await other.click();
  await expect(service).toHaveAttribute("aria-expanded", "false");
  await expect(other).toHaveAttribute("aria-expanded", "true");
  await expect(photo).toHaveCount(1);

  await other.click();
  await expect(other).toHaveAttribute("aria-expanded", "false");
  await expect(photo).toHaveCount(0);
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

test("added services open WhatsApp with those names", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/services");
  await acceptCookies(page);

  await expect(page.getByRole("list", { name: "Service categories" })).toBeVisible({
    timeout: 20_000,
  });

  const add = page.getByRole("button", { name: /^Add / }).first();
  const before = await add.boundingBox();
  const label = await add.getAttribute("aria-label");
  const serviceName = label.replace(/^Add /, "");
  await add.click();
  const added = page.getByRole("button", {
    name: `Remove ${serviceName}`,
    exact: true,
  });
  await expect(added).toHaveAttribute("aria-pressed", "true");
  const after = await added.boundingBox();
  expect(Math.abs(after.width - before.width)).toBeLessThan(1);

  const sheet = page.getByRole("dialog", { name: "Your booking" });
  await expect(sheet).toBeVisible();
  await expect(sheet).toContainText(
    "We send these names on WhatsApp. The salon replies with the time.",
  );
  await expect(sheet).toContainText(serviceName);
  const galleria = sheet.getByRole("link", { name: "Book at Galleria" });
  const rixos = sheet.getByRole("link", { name: "Book at Rixos" });
  await expect(galleria).toBeVisible();
  await expect(rixos).toBeVisible();
  await page.mouse.move(0, 0);
  const addedBg = await added.evaluate((el) => getComputedStyle(el).backgroundColor);
  const branchBg = await galleria.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(addedBg).toBe(branchBg);

  await sheet.getByRole("button", { name: "Continue adding" }).click();
  await expect(sheet).toBeHidden();
  const oneBar = page.getByRole("button", { name: "Your booking · 1 service" });
  await expect(oneBar).toBeVisible();
  await expect(oneBar.locator("svg")).toBeVisible();
  const motion = await oneBar.evaluate((el) => {
    const badge = el.querySelector("svg").parentElement;
    return {
      mirror: getComputedStyle(el, "::after").animationName,
      badge: getComputedStyle(badge).animationName,
      badgeBg: getComputedStyle(badge).backgroundColor,
    };
  });
  expect(motion.mirror).not.toBe("none");
  expect(motion.badge).not.toBe("none");
  expect(motion.badgeBg).toBe(addedBg);
  await page.reload();
  await expect(oneBar).toBeVisible();
  await page.goto("/");
  await expect(oneBar).toBeVisible();
  await page.goBack();
  await expect(oneBar).toBeVisible();
  await oneBar.click();
  await expect(sheet).toBeVisible();
  await sheet.getByRole("button", { name: "Continue adding" }).click();

  const secondAdd = page.getByRole("button", { name: /^Add / }).first();
  const secondName = (await secondAdd.getAttribute("aria-label")).replace(/^Add /, "");
  await secondAdd.click();
  await expect(sheet).toBeVisible();
  await expect(sheet).toContainText(secondName);
  const href = await galleria.getAttribute("href");
  expect(decodeURIComponent(href)).toContain(serviceName);
  expect(decodeURIComponent(href)).toContain(secondName);
  expect(href).toContain("https://wa.me/971503043570");

  const chosen = sheet.getByRole("list", { name: "Chosen services" });
  await chosen.getByRole("button", { name: `Remove ${secondName} from booking` }).click();
  await expect(sheet).toContainText(serviceName);
  await sheet.getByRole("button", { name: "Continue adding" }).click();
  const twoBar = page.getByRole("button", { name: "Your booking · 1 service" });
  await expect(twoBar).toBeVisible();
  const stored = await page.evaluate(() =>
    localStorage.getItem("ken-booking-services"),
  );
  expect(stored).toContain(serviceName);
  await twoBar.click();
  await expect(sheet).toBeVisible();
  await chosen.getByRole("button", { name: `Remove ${serviceName} from booking` }).click();
  await expect(sheet).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Your booking/ })).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.getItem("ken-booking-services")),
  ).toBeNull();
});
