import { describe, expect, it } from "vitest";
import { imagePriorityProps } from "./imagePriority";

describe("imagePriorityProps", () => {
  it("keeps the LCP image eager and high", () => {
    expect(imagePriorityProps(true)).toEqual({
      loading: "eager",
      fetchPriority: "high",
      priority: true,
    });
  });

  it("keeps every other content image lazy and low", () => {
    expect(imagePriorityProps(false)).toEqual({
      loading: "lazy",
      fetchPriority: "low",
      priority: false,
    });
  });
});
