# Testing Standards Guide

> **Official testing patterns and best practices for @the-memoize-project/router**

## Table of Contents

1. [Overview](#overview)
2. [Test File Structure](#test-file-structure)
3. [Naming Conventions](#naming-conventions)
4. [Test Patterns by Type](#test-patterns-by-type)
5. [Best Practices](#best-practices)
6. [Common Pitfalls](#common-pitfalls)
7. [Running Tests](#running-tests)

---

## Overview

This project uses **Vitest** as the test framework with **happy-dom** for browser API simulation. All tests must:

- Be written in English (descriptions, comments, variable names)
- Follow BDD-style test descriptions ("should...")
- Maintain minimum 80% coverage for core packages
- Use the AAA pattern (Arrange-Act-Assert) where applicable

---

## Test File Structure

### Standard Template

```javascript
import { describe, expect, it, vi } from "vitest";
import { functionUnderTest } from "./functionUnderTest.js";

describe("functionUnderTest", () => {
  it("should [expected behavior]", () => {
    // Arrange: Set up test data
    const input = ...;

    // Act: Execute the function
    const result = functionUnderTest(input);

    // Assert: Verify the result
    expect(result).toBe(expected);
  });
});
```

### With Setup/Teardown

```javascript
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { router } from "./router.js";

describe("router", () => {
  let originalLocation;

  beforeEach(() => {
    // Save original state
    originalLocation = globalThis.location.pathname;
    // Reset router state
    listeners.length = 0;
  });

  afterEach(() => {
    // Restore original state
    vi.clearAllMocks();
  });

  it("should [behavior]", () => {
    // Test implementation
  });
});
```

---

## Naming Conventions

### Test File Names

- **Pattern:** `[module-name].spec.js`
- **Location:** Co-located with source file
- **Extension:** `.spec.js` (preferred) or `.spec.ts`

**Examples:**
- `packages/router/router.spec.js`
- `packages/params/params.spec.js`
- `packages/matching/matching.spec.js`

### Test Description Format

**Pattern:** `should [action/behavior] [expected result]`

**Good Examples:**
```javascript
it("should match route with dynamic parameter")
it("should return empty object when no params")
it("should extract query string parameters")
it("should throw error when path is invalid")
it("should call handler when route matches")
```

**Bad Examples:**
```javascript
it("matches route")  // Missing "should"
it("deve corresponder rota")  // Portuguese
it("test router function")  // Not descriptive
it("works")  // Too vague
```

### Variable Naming in Tests

**Good:**
```javascript
const matchedRoute = matching();
const extractedParams = params();
const expectedUrl = "https://example.com/users/123";
```

**Bad:**
```javascript
const r = matching();  // Too short
const rota = matching();  // Portuguese
const x = params();  // Not descriptive
```

---

## Test Patterns by Type

### Pattern 1: Router Registration Tests

**Use for:** Testing route registration and chainable API

```javascript
import { describe, expect, it, beforeEach } from "vitest";
import router from "./router.js";
import listeners from "../listeners/index.js";

describe("router", () => {
  beforeEach(() => {
    listeners.length = 0;
  });

  it("should register a route", () => {
    const handler = () => {};
    router("/users", handler);

    expect(listeners).toHaveLength(1);
    expect(listeners[0].path).toBe("/users");
    expect(listeners[0].page).toBe(handler);
  });

  it("should support chainable API", () => {
    router("/", () => {})("/about", () => {});

    expect(listeners).toHaveLength(2);
  });
});
```

**Key Points:**
- Reset listeners before each test
- Test both registration and chaining
- Verify correct data structure

---

### Pattern 2: Pattern Matching Tests

**Use for:** Testing route matching logic

```javascript
import { describe, expect, it, beforeEach } from "vitest";
import matching from "./matching.js";
import listeners from "../listeners/index.js";

describe("matching", () => {
  beforeEach(() => {
    listeners.length = 0;
  });

  it("should match exact path", () => {
    const handler = () => {};
    listeners.push({ path: "/about", page: handler });

    // Simulate navigation
    Object.defineProperty(globalThis, "location", {
      value: { pathname: "/about" },
      writable: true,
    });

    const result = matching();
    expect(result.page).toBe(handler);
  });

  it("should match path with parameter", () => {
    const handler = () => {};
    listeners.push({ path: "/users/:id", page: handler });

    Object.defineProperty(globalThis, "location", {
      value: { pathname: "/users/123" },
      writable: true,
    });

    const result = matching();
    expect(result.page).toBe(handler);
  });

  it("should return fallback when no match", () => {
    Object.defineProperty(globalThis, "location", {
      value: { pathname: "/nonexistent" },
      writable: true,
    });

    const result = matching();
    expect(result.page).toBeUndefined();
  });
});
```

**Key Points:**
- Mock `globalThis.location` for different paths
- Test exact matches, parameterized routes, and fallback
- Reset state between tests

---

### Pattern 3: Parameter Extraction Tests

**Use for:** Testing `params()` function

```javascript
import { describe, expect, it, beforeEach } from "vitest";
import params from "./params.js";

describe("params", () => {
  beforeEach(() => {
    // Reset params state
    params.reset?.();
  });

  it("should extract single parameter", () => {
    Object.defineProperty(globalThis, "location", {
      value: { pathname: "/users/123" },
      writable: true,
    });

    params("/users/:id");
    const result = params();

    expect(result).toEqual({ id: "123" });
  });

  it("should extract multiple parameters", () => {
    Object.defineProperty(globalThis, "location", {
      value: { pathname: "/users/123/posts/456" },
      writable: true,
    });

    params("/users/:userId/posts/:postId");
    const result = params();

    expect(result).toEqual({ userId: "123", postId: "456" });
  });

  it("should return empty object for no parameters", () => {
    Object.defineProperty(globalThis, "location", {
      value: { pathname: "/about" },
      writable: true,
    });

    params("/about");
    const result = params();

    expect(result).toEqual({});
  });
});
```

---

### Pattern 4: Query String Tests

**Use for:** Testing `args()` function

```javascript
import { describe, expect, it } from "vitest";
import args from "./args.js";

describe("args", () => {
  it("should parse query string parameters", () => {
    Object.defineProperty(globalThis, "location", {
      value: { search: "?q=router&page=2" },
      writable: true,
    });

    const result = args();

    expect(result).toEqual({ q: "router", page: "2" });
  });

  it("should return empty object for no query string", () => {
    Object.defineProperty(globalThis, "location", {
      value: { search: "" },
      writable: true,
    });

    const result = args();

    expect(result).toEqual({});
  });

  it("should handle URL-encoded values", () => {
    Object.defineProperty(globalThis, "location", {
      value: { search: "?q=hello%20world" },
      writable: true,
    });

    const result = args();

    expect(result).toEqual({ q: "hello world" });
  });
});
```

---

### Pattern 5: URL Generation Tests

**Use for:** Testing `urlFor()` function

```javascript
import { describe, expect, it, beforeEach } from "vitest";
import urlFor from "./urlFor.js";
import listeners from "../listeners/index.js";

describe("urlFor", () => {
  beforeEach(() => {
    listeners.length = 0;
    Object.defineProperty(globalThis, "location", {
      value: { origin: "https://example.com" },
      writable: true,
    });
  });

  it("should generate URL for named route", () => {
    function userProfile() {}
    listeners.push({ path: "/users/:id", page: userProfile });

    const result = urlFor("userProfile", { id: 123 });

    expect(result).toBe("https://example.com/users/123");
  });

  it("should return '#' for unknown route", () => {
    const result = urlFor("nonexistent", {});

    expect(result).toBe("#");
  });

  it("should handle multiple parameters", () => {
    function postDetail() {}
    listeners.push({ path: "/users/:userId/posts/:postId", page: postDetail });

    const result = urlFor("postDetail", { userId: 1, postId: 42 });

    expect(result).toBe("https://example.com/users/1/posts/42");
  });
});
```

---

### Pattern 6: Handler Execution Tests

**Use for:** Testing `handle()` function

```javascript
import { describe, expect, it, vi, beforeEach } from "vitest";
import handle from "./handle.js";
import listeners from "../listeners/index.js";

describe("handle", () => {
  beforeEach(() => {
    listeners.length = 0;
  });

  it("should call matching handler", () => {
    const handler = vi.fn();
    listeners.push({ path: "/", page: handler });

    Object.defineProperty(globalThis, "location", {
      value: { pathname: "/", search: "" },
      writable: true,
    });

    handle();

    expect(handler).toHaveBeenCalledOnce();
  });

  it("should call fallback when no match", () => {
    const fallbackHandler = vi.fn();
    // Set up fallback
    // ...

    Object.defineProperty(globalThis, "location", {
      value: { pathname: "/nonexistent", search: "" },
      writable: true,
    });

    handle();

    expect(fallbackHandler).toHaveBeenCalledOnce();
  });
});
```

---

## Best Practices

### 1. One Assertion Per Test (When Possible)

**Good:**
```javascript
it("should match route", () => {
  expect(matching().page).toBe(handler);
});

it("should extract route parameters", () => {
  expect(params()).toEqual({ id: "123" });
});
```

**Acceptable (Related Assertions):**
```javascript
it("should register route with correct properties", () => {
  router("/users/:id", handler);

  expect(listeners[0].path).toBe("/users/:id");
  expect(listeners[0].page).toBe(handler);
});
```

### 2. Use Descriptive Test Data

**Good:**
```javascript
const routeWithParameter = "/users/:id";
const pathWithUserId = "/users/123";
const expectedParams = { id: "123" };
```

**Bad:**
```javascript
const route = "/users/:id";
const path = "/users/123";
const result = { id: "123" };
```

### 3. Mock Only What You Need

**Good:**
```javascript
Object.defineProperty(globalThis, "location", {
  value: { pathname: "/users/123" },
  writable: true,
});
```

**Bad:**
```javascript
// Mocking entire window object when only location is needed
vi.mock("window");
```

### 4. Test Behavior, Not Implementation

**Good:**
```javascript
it("should match parameterized route", () => {
  const result = matching();
  expect(result.page).toBe(handler);
});
```

**Bad:**
```javascript
it("should use regex for matching", () => {
  // Testing implementation detail
  expect(matching.pattern).toMatch(/\^\\\/users/);
});
```

### 5. Use AAA Pattern for Clarity

```javascript
it("should extract params from URL", () => {
  // Arrange
  Object.defineProperty(globalThis, "location", {
    value: { pathname: "/users/123" },
    writable: true,
  });
  params("/users/:id");

  // Act
  const result = params();

  // Assert
  expect(result).toEqual({ id: "123" });
});
```

---

## Common Pitfalls

### Pitfall 1: Not Resetting State

**Bad:**
```javascript
describe("router", () => {
  it("test 1", () => {
    router("/a", () => {});
    // Listeners now has 1 route
  });

  it("test 2", () => {
    // Listeners still has 1 route from previous test!
    router("/b", () => {});
    expect(listeners).toHaveLength(1); // Fails: has 2
  });
});
```

**Good:**
```javascript
describe("router", () => {
  beforeEach(() => {
    listeners.length = 0;
  });

  it("test 1", () => {
    router("/a", () => {});
    expect(listeners).toHaveLength(1);
  });

  it("test 2", () => {
    router("/b", () => {});
    expect(listeners).toHaveLength(1); // Passes
  });
});
```

---

### Pitfall 2: Not Mocking Location

**Bad:**
```javascript
it("should match route", () => {
  // Uses actual browser location - unpredictable
  const result = matching();
});
```

**Good:**
```javascript
it("should match route", () => {
  Object.defineProperty(globalThis, "location", {
    value: { pathname: "/users/123" },
    writable: true,
  });

  const result = matching();
  expect(result.page).toBeDefined();
});
```

---

### Pitfall 3: Testing Multiple Unrelated Things

**Bad:**
```javascript
it("should work correctly", () => {
  router("/", () => {});
  expect(listeners).toHaveLength(1);

  const result = params();
  expect(result).toEqual({});

  const url = urlFor("test", {});
  expect(url).toBe("#");
});
```

**Good:**
```javascript
describe("router functionality", () => {
  it("should register routes", () => {
    router("/", () => {});
    expect(listeners).toHaveLength(1);
  });

  it("should return empty params for no parameters", () => {
    const result = params();
    expect(result).toEqual({});
  });

  it("should return # for unknown routes", () => {
    const url = urlFor("unknown", {});
    expect(url).toBe("#");
  });
});
```

---

## Running Tests

### Run All Tests

```bash
bun run test
```

### Run Tests with Coverage

```bash
bun run test --coverage
```

### Run Specific Test File

```bash
bun run test packages/router/router.spec.js
```

### Run Tests in Watch Mode

```bash
bun run test --watch
```

### Run Tests for Specific Package

```bash
bun run test packages/params
```

---

## Coverage Requirements

### Thresholds (Enforced)

- **Statements:** 80%
- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%

### Package Status

All packages should maintain high coverage:

- router/
- params/
- args/
- urlFor/
- matching/
- handle/
- listeners/
- fallback/
- pushState/
- popState/

---

## Quick Reference

### Essential Vitest Imports

```javascript
import {
  describe,        // Group related tests
  it,             // Define individual test
  expect,         // Assertion library
  vi,             // Mock/spy utilities
  beforeEach,     // Setup before each test
  afterEach,      // Cleanup after each test
  beforeAll,      // Setup once before all tests
  afterAll,       // Cleanup once after all tests
} from "vitest";
```

### Common Assertions

```javascript
// Equality
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality
expect(value).toStrictEqual(expected);  // Strict deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeUndefined();

// Strings
expect(string).toContain("substring");
expect(string).toMatch(/pattern/);

// Arrays/Objects
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(obj).toHaveProperty("key", "value");

// Functions
expect(fn).toThrow();
expect(spy).toHaveBeenCalled();
expect(spy).toHaveBeenCalledWith(arg1, arg2);
expect(spy).toHaveBeenCalledTimes(2);
```

### Common Mock Patterns

```javascript
// Mock function
const mockFn = vi.fn();
const mockFn = vi.fn().mockReturnValue(42);

// Spy on method
const spy = vi.spyOn(obj, "method");

// Clear mocks
vi.clearAllMocks();
vi.resetAllMocks();
vi.restoreAllMocks();
```

---

## Learn More

- **Official Docs:** [Vitest Documentation](https://vitest.dev/)
- **happy-dom:** [happy-dom Documentation](https://github.com/capricorn86/happy-dom)
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Last Updated:** 2024-12
**Version:** 1.0.0
