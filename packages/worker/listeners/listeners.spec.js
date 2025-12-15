import { describe, it, expect } from "vitest";
import listeners from "./listeners.js";

describe("listeners (worker)", () => {
  it("should have DELETE array", () => {
    expect(Array.isArray(listeners.DELETE)).toBe(true);
  });

  it("should have GET array", () => {
    expect(Array.isArray(listeners.GET)).toBe(true);
  });

  it("should have POST array", () => {
    expect(Array.isArray(listeners.POST)).toBe(true);
  });

  it("should have PUT array", () => {
    expect(Array.isArray(listeners.PUT)).toBe(true);
  });
});
