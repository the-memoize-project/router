import { describe, it, expect, beforeEach } from "vitest";
import params from "./params";

describe("params", () => {
  beforeEach(() => {
    Object.keys(params).forEach((key) => delete params[key]);
  });

  it("should extract path parameters", () => {
    window.location.href = "http://localhost:3000/user/123/profile";

    params("/user/:id/:section");

    expect(params.id).toBe("123");
    expect(params.section).toBe("profile");
  });

  it("should handle routes without parameters", () => {
    window.location.href = "http://localhost:3000/home";

    params("/home");

    expect(Object.keys(params).filter((k) => typeof params[k] !== "function"))
      .toHaveLength(0);
  });

  it("should clean previous params", () => {
    window.location.href = "http://localhost:3000/user/123";
    params("/user/:id");
    expect(params.id).toBe("123");

    window.location.href = "http://localhost:3000/product/abc";
    params("/product/:slug");
    expect(params.id).toBeUndefined();
    expect(params.slug).toBe("abc");
  });
});
