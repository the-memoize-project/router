import { describe, it, expect, beforeEach } from "vitest";
import listeners from "./listeners";

describe("listeners", () => {
  beforeEach(() => {
    listeners.length = 0;
  });

  it("should be an array", () => {
    expect(Array.isArray(listeners)).toBe(true);
  });

  it("should store routes", () => {
    const page = () => {};
    listeners.push({ path: "/home", page });

    expect(listeners).toHaveLength(1);
    expect(listeners[0].path).toBe("/home");
    expect(listeners[0].page).toBe(page);
  });

  it("should allow multiple routes", () => {
    listeners.push({ path: "/home", page: () => {} });
    listeners.push({ path: "/about", page: () => {} });

    expect(listeners).toHaveLength(2);
  });
});
