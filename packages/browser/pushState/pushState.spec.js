import { describe, it, expect, vi } from "vitest";

describe("pushState", () => {
  it("should intercept history.pushState", async () => {
    const handler = vi.fn();
    window.addEventListener("pushstate", handler);

    const { default: pushState } = await import("./pushState");
    pushState();

    history.pushState(null, "", "/test");

    expect(handler).toHaveBeenCalled();

    window.removeEventListener("pushstate", handler);
  });
});
