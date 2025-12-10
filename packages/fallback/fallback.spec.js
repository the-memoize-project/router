import { describe, it, expect, vi } from "vitest";
import fallback from "./fallback";

describe("fallback", () => {
  it("should be a function", () => {
    expect(typeof fallback).toBe("function");
  });

  it("should set page callback", () => {
    const page = vi.fn();

    fallback(page);

    expect(fallback.page).toBe(page);
  });

  it("should update path", () => {
    window.location.href = "http://localhost:3000/unknown";

    fallback(() => {});

    expect(fallback.path).toBe("/unknown");
  });
});
