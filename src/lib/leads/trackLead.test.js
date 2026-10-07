import { afterEach, describe, expect, it, vi } from "vitest";
import { recordOutbound, resetLeadClickWindow } from "@/lib/leads/trackLead";

function stubBrowser({ sendBeacon, session = {}, href = "https://ken-salon.com/services?x=1" }) {
  vi.stubGlobal("window", {
    crypto: { randomUUID: () => "4c5216d8-53b7-4d6c-bb5c-10ea38fd3313" },
    dataLayer: [],
    localStorage: { getItem: () => null },
    sessionStorage: { getItem: (key) => session[key] ?? null },
    location: { pathname: "/services", href },
  });
  vi.stubGlobal("document", { cookie: "", referrer: "https://www.google.com/" });
  vi.stubGlobal("navigator", { sendBeacon });
}

async function sentPayload(sendBeacon) {
  const [, blob] = sendBeacon.mock.calls[0];
  return JSON.parse(await blob.text());
}

describe("recordOutbound", () => {
  afterEach(() => {
    resetLeadClickWindow();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("shares one event ID between GTM and the stored click", async () => {
    const sendBeacon = vi.fn(() => true);
    stubBrowser({ sendBeacon });

    const eventId = recordOutbound("https://wa.me/971503043570", {
      branch: "galleria",
      gtm: true,
      services: [{ id: "cut", name: "Haircut" }],
    });

    expect(eventId).toBe("4c5216d8-53b7-4d6c-bb5c-10ea38fd3313");
    expect(window.dataLayer).toContainEqual(
      expect.objectContaining({
        event: "whatsapp_click",
        event_id: eventId,
        whatsapp_branch: "galleria",
      }),
    );

    expect(await sentPayload(sendBeacon)).toMatchObject({
      eventId,
      eventType: "whatsapp",
      branch: "galleria",
      target: "971503043570",
      pagePath: "/services",
      services: [{ id: "cut", name: "Haircut" }],
    });
  });

  it("sends the first-touch visit, tap page, placement, and live referrer", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-05T10:02:00Z"));
    const sendBeacon = vi.fn(() => true);
    stubBrowser({
      sendBeacon,
      session: {
        ken_first_visit: JSON.stringify({
          visitId: "visit-abcdef123456",
          landingUrl: "https://ken-salon.com/en?utm_source=meta&fbclid=FB123",
          landingReferrer: "https://l.facebook.com/",
          landedAt: "2026-10-05T10:00:00.000Z",
        }),
      },
    });

    recordOutbound("tel:+971555570029", { placement: "footer" });

    expect(await sentPayload(sendBeacon)).toMatchObject({
      eventType: "phone",
      referrer: "https://www.google.com/",
      visitId: "visit-abcdef123456",
      landingUrl: "https://ken-salon.com/en?utm_source=meta&fbclid=FB123",
      landingReferrer: "https://l.facebook.com/",
      landedAt: "2026-10-05T10:00:00.000Z",
      pageUrl: "https://ken-salon.com/services?x=1",
      utmSource: "meta",
      utmMedium: null,
      fbclid: "FB123",
      ttclid: null,
      placement: "footer",
      secondsOnSite: 120,
    });
  });

  it("sends null first-touch fields when no visit was saved", async () => {
    const sendBeacon = vi.fn(() => true);
    stubBrowser({ sendBeacon });

    recordOutbound("mailto:info@ken-salon.com");

    expect(await sentPayload(sendBeacon)).toMatchObject({
      visitId: null,
      landingUrl: null,
      secondsOnSite: null,
      placement: null,
      pageUrl: "https://ken-salon.com/services?x=1",
    });
  });

  it("logs five clicks in a minute, then stays quiet while the link still opens", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-07T18:12:00Z"));
    const sendBeacon = vi.fn(() => true);
    stubBrowser({ sendBeacon });
    let n = 0;
    window.crypto.randomUUID = () =>
      `4c5216d8-53b7-4d6c-bb5c-10ea38fd33${String(n++).padStart(2, "0")}`;

    for (let i = 0; i < 5; i += 1) {
      expect(recordOutbound("https://wa.me/971503043570", { gtm: true })).toBeTruthy();
    }
    expect(recordOutbound("https://wa.me/971503043570", { gtm: true })).toBeUndefined();

    expect(sendBeacon).toHaveBeenCalledTimes(5);
    expect(window.dataLayer).toHaveLength(5);

    vi.setSystemTime(new Date("2026-10-07T18:13:00Z"));
    expect(recordOutbound("https://wa.me/971503043570", { gtm: true })).toBeTruthy();
    expect(sendBeacon).toHaveBeenCalledTimes(6);
  });
});
