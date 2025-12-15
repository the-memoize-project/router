import { describe, it, expect, beforeEach } from "vitest";
import params from "./params.js";

describe("params (worker)", () => {
  beforeEach(() => {
    // Clean previous params
    Object.keys(params).forEach((key) => delete params[key]);
  });

  it("should extract single parameter from URL", () => {
    const request = new Request("https://api.example.com/users/123");
    const path = "/users/:id";

    params(request, path);

    expect(params.id).toBe("123");
  });

  it("should extract multiple parameters from URL", () => {
    const request = new Request("https://api.example.com/users/123/posts/456");
    const path = "/users/:userId/posts/:postId";

    params(request, path);

    expect(params.userId).toBe("123");
    expect(params.postId).toBe("456");
  });

  it("should handle paths without parameters", () => {
    const request = new Request("https://api.example.com/users");
    const path = "/users";

    params(request, path);

    expect(Object.keys(params).filter((k) => typeof params[k] !== "function")).toHaveLength(0);
  });

  it("should override previous params", () => {
    const request1 = new Request("https://api.example.com/users/123");
    params(request1, "/users/:id");
    expect(params.id).toBe("123");

    const request2 = new Request("https://api.example.com/users/456");
    params(request2, "/users/:id");
    expect(params.id).toBe("456");
  });
});
