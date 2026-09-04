import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/assistant/models", () => ({
  getAssistantModels: vi.fn(),
}));

import { GET } from "@/app/api/cron/assistant-cleanup/route";
import { getAssistantModels } from "@/lib/assistant/models";

describe("GET /api/cron/assistant-cleanup", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("returns 503 when CRON_SECRET is missing", async () => {
    vi.stubEnv("CRON_SECRET", "");
    const res = await GET(new Request("http://localhost/api/cron/assistant-cleanup"));
    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toMatchObject({ success: false });
    expect(getAssistantModels).not.toHaveBeenCalled();
  });

  it("returns 401 when the bearer token does not match", async () => {
    vi.stubEnv("CRON_SECRET", "expected-secret");
    const res = await GET(
      new Request("http://localhost/api/cron/assistant-cleanup", {
        headers: { authorization: "Bearer wrong" },
      })
    );
    expect(res.status).toBe(401);
    expect(getAssistantModels).not.toHaveBeenCalled();
  });

  it("scans only this business open/idle rows and returns counts", async () => {
    vi.stubEnv("CRON_SECRET", "expected-secret");
    const updateOne = vi.fn().mockResolvedValue({});
    const lean = vi.fn().mockResolvedValue([]);
    const limit = vi.fn().mockReturnValue({ lean });
    const select = vi.fn().mockReturnValue({ limit });
    const find = vi.fn().mockReturnValue({ select });
    getAssistantModels.mockResolvedValue({
      AssistantConversation: { find, updateOne },
    });

    const res = await GET(
      new Request("http://localhost/api/cron/assistant-cleanup", {
        headers: { authorization: "Bearer expected-secret" },
      })
    );
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      success: true,
      data: { scanned: 0, markedIdle: 0, closed: 0 },
    });
    expect(find).toHaveBeenCalledWith({
      businessSlug: "ken-beauty-salon",
      status: { $in: ["open", "idle"] },
    });
    expect(limit).toHaveBeenCalledWith(500);
  });
});
