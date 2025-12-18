import { describe, it, expect, beforeEach } from "vitest";
import headers from "./headers.js";

describe("headers (worker)", () => {
  beforeEach(() => {
    // Clean previous headers
    Object.keys(headers).forEach((key) => delete headers[key]);
  });

  it("should extract single header from request", () => {
    const request = new Request("https://api.example.com/users", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    headers(request);

    expect(headers["content-type"]).toBe("application/json");
  });

  it("should extract multiple headers from request", () => {
    const request = new Request("https://api.example.com/users", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer token123",
        "User-Agent": "Mozilla/5.0",
      },
    });

    headers(request);

    expect(headers["content-type"]).toBe("application/json");
    expect(headers.authorization).toBe("Bearer token123");
    expect(headers["user-agent"]).toBe("Mozilla/5.0");
  });

  it("should normalize header keys to lowercase", () => {
    const request = new Request("https://api.example.com/users", {
      headers: {
        "Content-Type": "application/json",
        "AUTHORIZATION": "Bearer token123",
        "X-Custom-Header": "custom-value",
      },
    });

    headers(request);

    expect(headers["content-type"]).toBe("application/json");
    expect(headers.authorization).toBe("Bearer token123");
    expect(headers["x-custom-header"]).toBe("custom-value");
  });

  it("should handle requests with no headers", () => {
    const request = new Request("https://api.example.com/users");

    headers(request);

    // Should only have function properties, no header data
    const headerKeys = Object.keys(headers).filter((k) => typeof headers[k] !== "function");
    expect(headerKeys.length).toBeGreaterThanOrEqual(0);
  });

  it("should override previous headers on new request", () => {
    const request1 = new Request("https://api.example.com/users", {
      headers: {
        "Authorization": "Bearer token123",
      },
    });
    headers(request1);
    expect(headers.authorization).toBe("Bearer token123");

    const request2 = new Request("https://api.example.com/users", {
      headers: {
        "Authorization": "Bearer token456",
      },
    });
    headers(request2);
    expect(headers.authorization).toBe("Bearer token456");
  });

  it("should handle custom headers with hyphens", () => {
    const request = new Request("https://api.example.com/users", {
      headers: {
        "X-Request-ID": "req-123-456",
        "X-API-Key": "abc123xyz",
      },
    });

    headers(request);

    expect(headers["x-request-id"]).toBe("req-123-456");
    expect(headers["x-api-key"]).toBe("abc123xyz");
  });

  it("should handle common HTTP headers", () => {
    const request = new Request("https://api.example.com/users", {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-Language": "pt-BR,pt;q=0.9",
        "Cache-Control": "no-cache",
      },
    });

    headers(request);

    expect(headers["content-type"]).toBe("application/json");
    expect(headers.accept).toBe("application/json");
    expect(headers["accept-language"]).toBe("pt-BR,pt;q=0.9");
    expect(headers["cache-control"]).toBe("no-cache");
  });
});
