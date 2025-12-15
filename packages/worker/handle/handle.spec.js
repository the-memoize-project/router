import { describe, it, expect, beforeEach } from "vitest";
import handle from "./handle.js";
import listeners from "../listeners/listeners.js";

describe("handle (worker)", () => {
  beforeEach(() => {
    listeners.GET.length = 0;
    listeners.POST.length = 0;
  });

  it("should execute matching route handler", async () => {
    const handler = async () => new Response("User 123");

    listeners.GET.push({ path: "/users/:id", page: handler, name: "handler" });

    const request = new Request("https://api.example.com/users/123", {
      method: "GET",
    });

    const response = await handle(request, {}, {});

    expect(response).toBeInstanceOf(Response);
    expect(await response.text()).toBe("User 123");
  });

  it("should return undefined if no route matches", async () => {
    const request = new Request("https://api.example.com/not-found", {
      method: "GET",
    });

    const response = await handle(request, {}, {});

    expect(response).toBeUndefined();
  });

  it("should pass env and ctx to handler", async () => {
    let receivedEnv, receivedCtx;

    const handler = async (request, env, ctx) => {
      receivedEnv = env;
      receivedCtx = ctx;
      return new Response("OK");
    };

    listeners.GET.push({ path: "/test", page: handler, name: "handler" });

    const request = new Request("https://api.example.com/test", {
      method: "GET",
    });
    const env = { TEST: "value" };
    const ctx = { waitUntil: () => {} };

    await handle(request, env, ctx);

    expect(receivedEnv).toBe(env);
    expect(receivedCtx).toBe(ctx);
  });
});
