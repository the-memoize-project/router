import { describe, it, expect, beforeEach } from "vitest";
import match from "./match.js";
import listeners from "../listeners/listeners.js";

describe("match (worker)", () => {
  beforeEach(() => {
    // Clean listeners
    listeners.GET.length = 0;
    listeners.POST.length = 0;
  });

  it("should find matching GET route", () => {
    const handler = () => new Response("OK");
    listeners.GET.push({ path: "/users/:id", page: handler, name: "handler" });

    const request = new Request("https://api.example.com/users/123", {
      method: "GET",
    });

    const { page, path } = match(request);

    expect(page).toBe(handler);
    expect(path).toBe("/users/:id");
  });

  it("should return empty object if no match", () => {
    const request = new Request("https://api.example.com/not-found", {
      method: "GET",
    });

    const result = match(request);

    expect(result).toEqual({});
  });

  it("should match by HTTP method", () => {
    const getHandler = () => new Response("GET");
    const postHandler = () => new Response("POST");

    listeners.GET.push({ path: "/users", page: getHandler, name: "getHandler" });
    listeners.POST.push({ path: "/users", page: postHandler, name: "postHandler" });

    const getRequest = new Request("https://api.example.com/users", {
      method: "GET",
    });
    const postRequest = new Request("https://api.example.com/users", {
      method: "POST",
    });

    expect(match(getRequest).page).toBe(getHandler);
    expect(match(postRequest).page).toBe(postHandler);
  });
});
