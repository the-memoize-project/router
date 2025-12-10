import { describe, it, expect, beforeEach } from "vitest";
import urlFor from "./urlFor";
import listeners from "../listeners/listeners";

describe("urlFor", () => {
  beforeEach(() => {
    listeners.length = 0;
    window.location.href = "http://localhost/";
  });

  it("should generate URL for named route", () => {
    const page = function userPage() {};
    listeners.push({ path: "/user/:id", page });

    const url = urlFor("userPage", { id: 123 });

    expect(url).toBe("http://localhost/user/123");
  });

  it("should return # for unknown route", () => {
    const url = urlFor("unknown", {});

    expect(url).toBe("#");
  });

  it("should handle multiple parameters", () => {
    const page = function productPage() {};
    listeners.push({ path: "/products/:category/:id", page });

    const url = urlFor("productPage", { category: "electronics", id: 456 });

    expect(url).toBe("http://localhost/products/electronics/456");
  });
});
