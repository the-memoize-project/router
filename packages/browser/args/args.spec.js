import { describe, it, expect, beforeEach } from "vitest";
import args from "./args";

describe("args", () => {
  beforeEach(() => {
    // Clean previous args
    Object.keys(args).forEach((key) => delete args[key]);
  });

  it("should extract query parameters from location.search", () => {
    // Mock location.search
    window.location.href = "http://localhost:3000/?page=1&sort=desc";

    args();

    expect(args.page).toBe("1");
    expect(args.sort).toBe("desc");
  });

  it("should handle empty query string", () => {
    window.location.href = "http://localhost:3000/";

    args();

    expect(Object.keys(args).filter((k) => typeof args[k] !== "function"))
      .toHaveLength(0);
  });

  it("should override previous args", () => {
    window.location.href = "http://localhost:3000/?page=1";
    args();
    expect(args.page).toBe("1");

    window.location.href = "http://localhost:3000/?page=2";
    args();
    expect(args.page).toBe("2");
  });
});
