import { describe, it, expect, beforeEach } from "vitest";
import matching from "./matching";
import listeners from "../listeners/listeners";
import fallback from "../fallback/fallback";

describe("matching", () => {
  beforeEach(() => {
    listeners.length = 0;
  });

  it("should find matching route", () => {
    window.location.href = "http://localhost:3000/user/123";
    const page = () => {};
    listeners.push({ path: "/user/:id", page });

    const route = matching();

    expect(route.path).toBe("/user/:id");
    expect(route.page).toBe(page);
  });

  it("should return fallback when no route matches", () => {
    window.location.href = "http://localhost:3000/unknown";
    listeners.push({ path: "/home", page: () => {} });

    const route = matching();

    expect(route).toBe(fallback);
  });

  it("should match case-insensitively", () => {
    window.location.href = "http://localhost:3000/USER/123";
    const page = () => {};
    listeners.push({ path: "/user/:id", page });

    const route = matching();

    expect(route.page).toBe(page);
  });
});
