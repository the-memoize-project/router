import { describe, it, expect, vi } from "vitest";

describe("pushState", () => {
  it("should intercept history.pushState", async () => {
    const handler = vi.fn();
    window.addEventListener("pushstate", handler);

    await import("./pushState");

    history.pushState(null, "", "/test");

    expect(handler).toHaveBeenCalled();

    window.removeEventListener("pushstate", handler);
  });
});
