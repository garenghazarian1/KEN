import { chromium } from "@playwright/test";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/services", { waitUntil: "networkidle", timeout: 45000 });
await page.evaluate(() => localStorage.removeItem("ken-booking-services"));
await page.reload({ waitUntil: "networkidle" });
const accept = page.getByRole("button", { name: "Accept all cookies" });
if (await accept.count()) await accept.click();

await page.getByRole("button", { name: /^Add / }).first().click();
const sheet = page.getByRole("dialog", { name: "Your booking" });
await sheet.waitFor({ state: "visible" });
const close = sheet.getByRole("button", { name: "Close", exact: true });
await close.screenshot({ path: "C:/Users/garen/AppData/Local/Temp/booking-close.png" });
await sheet.screenshot({ path: "C:/Users/garen/AppData/Local/Temp/booking-sheet.png" });
await close.click();
const hidden = await sheet.count();
const bar = page.getByRole("button", { name: /Your booking/ });
await bar.waitFor({ state: "visible" });
await bar.click();
await sheet.waitFor({ state: "visible" });
await sheet.getByRole("button", { name: "Continue adding" }).click();
const hiddenAgain = await sheet.count();
console.log(JSON.stringify({ closedByX: hidden === 0, closedByContinue: hiddenAgain === 0 }));
await browser.close();
