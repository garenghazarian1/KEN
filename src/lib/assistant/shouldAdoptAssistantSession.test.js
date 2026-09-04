import { describe, expect, it } from "vitest";
import { shouldAdoptAssistantSession } from "./shouldAdoptAssistantSession";

describe("shouldAdoptAssistantSession", () => {
  it("adopts when the panel is still open and generation is unchanged", () => {
    expect(
      shouldAdoptAssistantSession({
        panelOpen: true,
        startedGeneration: 2,
        currentGeneration: 2,
      })
    ).toBe(true);
  });

  it("rejects when the panel closed while the session request was in flight", () => {
    expect(
      shouldAdoptAssistantSession({
        panelOpen: false,
        startedGeneration: 0,
        currentGeneration: 0,
      })
    ).toBe(false);
  });

  it("rejects when End/close bumped generation before the response arrived", () => {
    expect(
      shouldAdoptAssistantSession({
        panelOpen: true,
        startedGeneration: 0,
        currentGeneration: 1,
      })
    ).toBe(false);
  });
});
