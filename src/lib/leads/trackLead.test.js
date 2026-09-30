import { afterEach, describe, expect, it, vi } from "vitest";
import { recordOutbound } from "@/lib/leads/trackLead";

describe("recordOutbound", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shares one event ID between GTM and the stored click", async () => {
    const sendBeacon = vi.fn(() => true);
    vi.stubGlobal("window", {
      crypto: { randomUUID: () => "4c5216d8-53b7-4d6c-bb5c-10ea38fd3313" },
      dataLayer: [],
      localStorage: { getItem: () => null },
      location: { pathname: "/services" },
    });
    vi.stubGlobal("document", { cookie: "" });
    vi.stubGlobal("navigator", { sendBeacon });

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

    const [, blob] = sendBeacon.mock.calls[0];
    const payload = JSON.parse(await blob.text());
    expect(payload).toMatchObject({
      eventId,
      eventType: "whatsapp",
      branch: "galleria",
      target: "971503043570",
      pagePath: "/services",
      services: [{ id: "cut", name: "Haircut" }],
    });
  });
});
