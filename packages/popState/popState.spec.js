import { describe, it, expect, vi } from "vitest";

describe("popState", () => {
  it("should listen to popstate event", async () => {
    const handler = vi.fn();

    await import("./popState");

    window.addEventListener("popstate", handler);
    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(handler).toHaveBeenCalled();

    window.removeEventListener("popstate", handler);
  });
});
