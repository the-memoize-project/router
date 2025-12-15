import { describe, it, expect, vi, beforeEach } from "vitest";
import handle from "./handle";
import listeners from "../listeners/listeners";

describe("handle", () => {
  beforeEach(() => {
    listeners.length = 0;
    window.location.href = "http://localhost:3000/user/123?tab=profile";
  });

  it("should execute matched route", () => {
    const page = vi.fn();
    listeners.push({ path: "/user/:id", page });

    handle();

    expect(page).toHaveBeenCalled();
  });

  it("should handle routes without page", () => {
    listeners.push({ path: "/user/:id", page: null });

    expect(() => handle()).not.toThrow();
  });
});
