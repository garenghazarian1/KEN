import { expect, test } from "@playwright/test";

function collectJsonPosts(page, matchPath) {
  const posts = [];
  page.on("request", (req) => {
    if (req.method() !== "POST") return;
    let pathname = "";
    try {
      pathname = new URL(req.url()).pathname;
    } catch {
      return;
    }
    if (pathname !== matchPath) return;
    try {
      posts.push(JSON.parse(req.postData() || "{}"));
    } catch {
      posts.push({});
    }
  });
  return posts;
}

async function openAssistant(page) {
  await page.goto("/");
  await page.getByRole("button", { name: /^Chat with Ani$/ }).click();
  await expect(page.getByRole("button", { name: "End chat" })).toBeVisible();
}

test.describe("Ani conversation close", () => {
  test("panel Close posts session/end with panel_closed", async ({ page }) => {
    const ends = collectJsonPosts(page, "/api/assistant/session/end");
    await openAssistant(page);
    await page.getByRole("button", { name: "Close assistant" }).click();
    await expect
      .poll(() => ends.some((body) => body.reason === "panel_closed"))
      .toBe(true);
    await expect(page.getByRole("dialog", { name: /Ani/i })).toBeHidden();
  });

  test("launcher Close Ani also posts panel_closed", async ({ page }) => {
    const ends = collectJsonPosts(page, "/api/assistant/session/end");
    await openAssistant(page);
    await page.getByRole("button", { name: "Close Ani" }).click();
    await expect
      .poll(() => ends.some((body) => body.reason === "panel_closed"))
      .toBe(true);
  });

  test("End chat posts user_end and starts a fresh session while the panel stays open", async ({
    page,
  }) => {
    const ends = collectJsonPosts(page, "/api/assistant/session/end");
    const sessions = collectJsonPosts(page, "/api/assistant/session");
    await openAssistant(page);
    expect(sessions.length).toBeGreaterThanOrEqual(1);
    const firstConversation = sessions[0]?.sessionId;

    await page.getByRole("button", { name: "End chat" }).click();
    await expect
      .poll(() => ends.some((body) => body.reason === "user_end"))
      .toBe(true);
    await expect(page.getByRole("dialog", { name: /Ani/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "End chat" })).toBeVisible();
    await expect.poll(() => sessions.length).toBeGreaterThanOrEqual(2);
    expect(firstConversation).toBeTruthy();
  });

  test("reopening after panel close starts a new session", async ({ page }) => {
    const sessions = collectJsonPosts(page, "/api/assistant/session");
    await openAssistant(page);
    await page.getByRole("button", { name: "Close assistant" }).click();
    await page.getByRole("button", { name: /^Chat with Ani$/ }).click();
    await expect(page.getByRole("button", { name: "End chat" })).toBeVisible();
    await expect.poll(() => sessions.length).toBeGreaterThanOrEqual(2);
  });

  test("typing a message does not close the conversation", async ({ page }) => {
    const ends = collectJsonPosts(page, "/api/assistant/session/end");
    await openAssistant(page);
    await page.getByRole("textbox", { name: "Message" }).fill("Where are you located?");
    await page.waitForTimeout(500);
    expect(ends).toEqual([]);
  });
});
