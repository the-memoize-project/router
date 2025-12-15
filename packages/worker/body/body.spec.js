import { describe, it, expect, beforeEach } from "vitest";
import body from "./body.js";

describe("body (worker)", () => {
  beforeEach(() => {
    // Clean previous body properties
    Object.keys(body).forEach((key) => delete body[key]);
  });

  it("should parse JSON body from POST request", async () => {
    const request = new Request("https://api.example.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "João", email: "joao@example.com" }),
    });

    await body(request);

    expect(body.name).toBe("João");
    expect(body.email).toBe("joao@example.com");
  });

  it("should parse JSON body from PUT request", async () => {
    const request = new Request("https://api.example.com/users/123", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Maria" }),
    });

    await body(request);

    expect(body.name).toBe("Maria");
  });

  it("should not parse body for GET request", async () => {
    const request = new Request("https://api.example.com/users", {
      method: "GET",
    });

    await body(request);

    expect(Object.keys(body).filter((k) => typeof body[k] !== "function")).toHaveLength(0);
  });

  it("should not parse body without JSON content-type", async () => {
    const request = new Request("https://api.example.com/users", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "plain text",
    });

    await body(request);

    expect(Object.keys(body).filter((k) => typeof body[k] !== "function")).toHaveLength(0);
  });
});
