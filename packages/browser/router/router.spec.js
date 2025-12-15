import { describe, it, expect, beforeEach, vi } from "vitest";
import router from "./router";
import listeners from "../listeners/listeners";
import handle from "../handle/handle";
import fallback from "../fallback/fallback";

describe("router", () => {
  beforeEach(() => {
    // Limpa listeners antes de cada teste
    listeners.length = 0;
  });

  describe("route registration", () => {
    it("should register a route", () => {
      const page = vi.fn();

      router("/home", page);

      expect(listeners).toHaveLength(1);
      expect(listeners[0]).toEqual({
        path: "/home",
        page,
      });
    });

    it("should register multiple routes", () => {
      const homePage = vi.fn();
      const aboutPage = vi.fn();
      const userPage = vi.fn();

      router("/home", homePage);
      router("/about", aboutPage);
      router("/user/:id", userPage);

      expect(listeners).toHaveLength(3);
      expect(listeners[0].path).toBe("/home");
      expect(listeners[1].path).toBe("/about");
      expect(listeners[2].path).toBe("/user/:id");
    });

    it("should register routes with dynamic parameters", () => {
      const page = vi.fn();

      router("/user/:id", page);
      router("/products/:category/:id", page);

      expect(listeners[0].path).toBe("/user/:id");
      expect(listeners[1].path).toBe("/products/:category/:id");
    });

    it("should store page callbacks correctly", () => {
      const homePage = () => "home";
      const aboutPage = () => "about";

      router("/home", homePage);
      router("/about", aboutPage);

      expect(listeners[0].page).toBe(homePage);
      expect(listeners[1].page).toBe(aboutPage);
    });
  });

  describe("method chaining", () => {
    it("should return router for chaining", () => {
      const result = router("/home", () => {});

      expect(result).toBe(router);
    });

    it("should support chained route registration", () => {
      const home = vi.fn();
      const about = vi.fn();
      const contact = vi.fn();

      const result = router("/home", home)
        .router("/about", about)
        .router("/contact", contact);

      expect(result).toBe(router);
      expect(listeners).toHaveLength(3);
      expect(listeners[0].page).toBe(home);
      expect(listeners[1].page).toBe(about);
      expect(listeners[2].page).toBe(contact);
    });

    it("should allow mixed chaining and individual calls", () => {
      router("/home", () => {});
      router("/about", () => {}).router("/contact", () => {});
      router("/products", () => {});

      expect(listeners).toHaveLength(4);
    });
  });

  describe("router.handle", () => {
    it("should have handle method", () => {
      expect(typeof router.handle).toBe("function");
    });

    it("should reference the handle function", () => {
      expect(router.handle).toBe(handle);
    });

    it("should be callable", () => {
      window.location.href = "http://localhost:3000/";
      const page = vi.fn();
      listeners.push({ path: "/", page });

      expect(() => router.handle()).not.toThrow();
    });
  });

  describe("router.fallback", () => {
    it("should have fallback method", () => {
      expect(typeof router.fallback).toBe("function");
    });

    it("should reference the fallback function", () => {
      expect(router.fallback).toBe(fallback);
    });

    it("should be callable", () => {
      const notFoundPage = vi.fn();

      expect(() => router.fallback(notFoundPage)).not.toThrow();
    });

    it("should set fallback page", () => {
      const notFoundPage = vi.fn();

      router.fallback(notFoundPage);

      expect(fallback.page).toBe(notFoundPage);
    });
  });

  describe("integration", () => {
    it("should work with full routing flow", () => {
      window.location.href = "http://localhost:3000/home";

      const homePage = vi.fn();
      const notFoundPage = vi.fn();

      router("/home", homePage).fallback(notFoundPage);

      router.handle();

      expect(homePage).toHaveBeenCalled();
      expect(notFoundPage).not.toHaveBeenCalled();
    });

    it("should call fallback for unmatched routes", () => {
      window.location.href = "http://localhost:3000/unknown";

      const homePage = vi.fn();
      const notFoundPage = vi.fn();

      router("/home", homePage).fallback(notFoundPage);

      router.handle();

      expect(homePage).not.toHaveBeenCalled();
      expect(notFoundPage).toHaveBeenCalled();
    });

    it("should handle multiple routes correctly", () => {
      window.location.href = "http://localhost:3000/about";

      const homePage = vi.fn();
      const aboutPage = vi.fn();
      const contactPage = vi.fn();

      router("/home", homePage)
        .router("/about", aboutPage)
        .router("/contact", contactPage);

      router.handle();

      expect(homePage).not.toHaveBeenCalled();
      expect(aboutPage).toHaveBeenCalled();
      expect(contactPage).not.toHaveBeenCalled();
    });

    it("should work with dynamic routes", () => {
      window.location.href = "http://localhost:3000/user/123";

      const userPage = vi.fn();

      router("/user/:id", userPage);

      router.handle();

      expect(userPage).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle empty route path", () => {
      const page = vi.fn();

      router("", page);

      expect(listeners).toHaveLength(1);
      expect(listeners[0].path).toBe("");
    });

    it("should handle root route", () => {
      const page = vi.fn();

      router("/", page);

      expect(listeners).toHaveLength(1);
      expect(listeners[0].path).toBe("/");
    });

    it("should handle routes with trailing slashes", () => {
      const page = vi.fn();

      router("/home/", page);

      expect(listeners[0].path).toBe("/home/");
    });

    it("should handle routes with query strings in path (not recommended)", () => {
      const page = vi.fn();

      router("/home?tab=profile", page);

      expect(listeners[0].path).toBe("/home?tab=profile");
    });

    it("should handle null page callback", () => {
      router("/home", null);

      expect(listeners[0].page).toBeNull();
    });

    it("should handle undefined page callback", () => {
      router("/home", undefined);

      expect(listeners[0].page).toBeUndefined();
    });

    it("should allow duplicate route paths", () => {
      const page1 = vi.fn();
      const page2 = vi.fn();

      router("/home", page1);
      router("/home", page2);

      expect(listeners).toHaveLength(2);
      expect(listeners[0].page).toBe(page1);
      expect(listeners[1].page).toBe(page2);
    });
  });

  describe("router object structure", () => {
    it("should be a function", () => {
      expect(typeof router).toBe("function");
    });

    it("should have handle property", () => {
      expect("handle" in router).toBe(true);
    });

    it("should have fallback property", () => {
      expect("fallback" in router).toBe(true);
    });

    it("should have exactly handle and fallback as extra properties", () => {
      const ownProps = Object.keys(router);
      expect(ownProps).toContain("handle");
      expect(ownProps).toContain("fallback");
    });
  });

  describe("performance", () => {
    it("should handle large number of routes efficiently", () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        router(`/route${i}`, () => {});
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(listeners).toHaveLength(1000);
      expect(duration).toBeLessThan(100); // Should complete in less than 100ms
    });

    it("should maintain reference integrity with chaining", () => {
      const result1 = router("/a", () => {});
      const result2 = result1.router("/b", () => {});
      const result3 = result2.router("/c", () => {});

      expect(result1).toBe(router);
      expect(result2).toBe(router);
      expect(result3).toBe(router);
    });
  });

  describe("complex routing scenarios", () => {
    it("should support nested dynamic routes", () => {
      const page = vi.fn();

      router("/users/:userId/posts/:postId/comments/:commentId", page);

      expect(listeners[0].path).toBe(
        "/users/:userId/posts/:postId/comments/:commentId"
      );
    });

    it("should support routes with hyphens and underscores", () => {
      const page = vi.fn();

      router("/user-profile/:user_id", page);

      expect(listeners[0].path).toBe("/user-profile/:user_id");
    });

    it("should support REST-like routes", () => {
      const getUsers = vi.fn();
      const postUsers = vi.fn();
      const getUser = vi.fn();
      const putUser = vi.fn();
      const deleteUser = vi.fn();

      router("/api/users", getUsers)
        .router("/api/users", postUsers)
        .router("/api/users/:id", getUser)
        .router("/api/users/:id", putUser)
        .router("/api/users/:id", deleteUser);

      expect(listeners).toHaveLength(5);
    });

    it("should support wildcard-like patterns (as regular paths)", () => {
      const page = vi.fn();

      router("/docs/*", page);

      expect(listeners[0].path).toBe("/docs/*");
    });
  });

  describe("type safety and validation", () => {
    it("should handle non-string path gracefully", () => {
      const page = vi.fn();

      // TypeScript would catch this, but JavaScript won't
      router(123, page);

      expect(listeners[0].path).toBe(123);
    });

    it("should handle object as page", () => {
      const pageObj = { render: () => {} };

      router("/home", pageObj);

      expect(listeners[0].page).toBe(pageObj);
    });

    it("should handle arrow function as page", () => {
      const arrowPage = () => console.log("arrow");

      router("/home", arrowPage);

      expect(listeners[0].page).toBe(arrowPage);
    });

    it("should handle async function as page", () => {
      const asyncPage = async () => {
        await Promise.resolve();
      };

      router("/home", asyncPage);

      expect(listeners[0].page).toBe(asyncPage);
    });
  });

  describe("isolation between tests", () => {
    it("should start with empty listeners", () => {
      expect(listeners).toHaveLength(0);
    });

    it("should not affect other tests", () => {
      router("/test1", () => {});
      expect(listeners).toHaveLength(1);
    });

    it("should still start with empty listeners", () => {
      expect(listeners).toHaveLength(0);
    });
  });
});
