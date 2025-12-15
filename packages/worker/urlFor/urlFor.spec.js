import { describe, it, expect, beforeEach } from "vitest";
import urlFor from "./urlFor.js";
import listeners from "../listeners/listeners.js";

describe("urlFor (worker)", () => {
  beforeEach(() => {
    listeners.GET.length = 0;
  });

  it("should generate URL from route name", () => {
    function getUser() {
      return new Response("OK");
    }

    listeners.GET.push({ path: "/users/:id", page: getUser, name: "getUser" });

    const url = urlFor(getUser, { id: "123" }, "https://api.example.com");

    expect(url).toBe("https://api.example.com/users/123");
  });

  it("should replace multiple parameters", () => {
    function getUserPost() {
      return new Response("OK");
    }

    listeners.GET.push({
      path: "/users/:userId/posts/:postId",
      page: getUserPost,
      name: "getUserPost",
    });

    const url = urlFor(
      getUserPost,
      { userId: "123", postId: "456" },
      "https://api.example.com",
    );

    expect(url).toBe("https://api.example.com/users/123/posts/456");
  });

  it("should work without host parameter", () => {
    function getUser() {
      return new Response("OK");
    }

    listeners.GET.push({ path: "/users/:id", page: getUser, name: "getUser" });

    const url = urlFor(getUser, { id: "123" });

    expect(url).toBe("/users/123");
  });

  it("should return # if route not found", () => {
    function notRegistered() {
      return new Response("OK");
    }

    const url = urlFor(notRegistered, {}, "https://api.example.com");

    expect(url).toBe("https://api.example.com#");
  });
});
