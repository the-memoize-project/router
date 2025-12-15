import { describe, it, expect, beforeEach } from "vitest";
import router from "./router.js";
import listeners from "../listeners/listeners.js";

describe("router (worker)", () => {
  beforeEach(() => {
    // Clean all listeners
    listeners.GET.length = 0;
    listeners.POST.length = 0;
    listeners.PUT.length = 0;
    listeners.DELETE.length = 0;
  });

  it("should register GET routes", () => {
    const handler = () => new Response("OK");
    router.get("/users", handler);

    expect(listeners.GET).toHaveLength(1);
    expect(listeners.GET[0].path).toBe("/users");
    expect(listeners.GET[0].page).toBe(handler);
  });

  it("should register POST routes", () => {
    const handler = () => new Response("OK");
    router.post("/users", handler);

    expect(listeners.POST).toHaveLength(1);
    expect(listeners.POST[0].path).toBe("/users");
  });

  it("should register PUT routes", () => {
    const handler = () => new Response("OK");
    router.put("/users/:id", handler);

    expect(listeners.PUT).toHaveLength(1);
    expect(listeners.PUT[0].path).toBe("/users/:id");
  });

  it("should register DELETE routes", () => {
    const handler = () => new Response("OK");
    router.delete("/users/:id", handler);

    expect(listeners.DELETE).toHaveLength(1);
    expect(listeners.DELETE[0].path).toBe("/users/:id");
  });

  it("should provide handle function", () => {
    expect(typeof router.handle).toBe("function");
  });
});
