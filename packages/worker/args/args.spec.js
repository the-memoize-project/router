import { describe, it, expect, beforeEach } from "vitest";
import args from "./args.js";

describe("args (worker)", () => {
  beforeEach(() => {
    // Clean previous args
    Object.keys(args).forEach((key) => delete args[key]);
  });

  it("should extract query parameters from request URL", () => {
    const request = new Request("https://api.example.com/users?page=1&sort=desc");

    args(request);

    expect(args.page).toBe("1");
    expect(args.sort).toBe("desc");
  });

  it("should handle empty query string", () => {
    const request = new Request("https://api.example.com/users");

    args(request);

    expect(Object.keys(args).filter((k) => typeof args[k] !== "function")).toHaveLength(0);
  });

  it("should override previous args", () => {
    const request1 = new Request("https://api.example.com/users?page=1");
    args(request1);
    expect(args.page).toBe("1");

    const request2 = new Request("https://api.example.com/users?page=2");
    args(request2);
    expect(args.page).toBe("2");
  });
});
