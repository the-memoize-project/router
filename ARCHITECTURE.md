# Memoize Router Architecture

This document describes the architecture, design decisions, and internal workings of the Memoize Router.

## Table of Contents

- [Philosophy](#philosophy)
- [Core Concepts](#core-concepts)
- [Architecture Overview](#architecture-overview)
- [Package Design](#package-design)
- [Data Flow](#data-flow)
- [Performance Considerations](#performance-considerations)
- [Design Patterns](#design-patterns)
- [Future Roadmap](#future-roadmap)

---

## Philosophy

### The Navigation System Analogy

Memoize Router is designed like a GPS navigation system: you define destinations (routes), it watches for location changes, and guides the user to the right place. Similarly:

- **Routes (Destinations)** - Defined paths with clear handlers
- **Matching (GPS)** - Finds which route matches the current location
- **Parameters (Coordinates)** - Extract meaningful data from paths
- **Navigation** - Seamless transitions between views

### Design Principles

1. **Simplicity First** - Zero configuration, intuitive API
2. **Zero Dependencies** - Built on native Web Platform APIs
3. **Framework Agnostic** - Works with any framework or vanilla JS
4. **Pattern-Based** - Familiar URL pattern syntax (`/users/:id`)
5. **Functional** - Pure functions, predictable behavior
6. **Minimal Surface Area** - Small, focused API surface

---

## Core Concepts

### History API as Foundation

Memoize Router is built on the browser's native History API:

- **`pushState()`** - Navigate to new routes programmatically
- **`popstate` event** - Detect browser back/forward navigation
- **`location.pathname`** - Current route path
- **`location.search`** - Query string parameters

### Pattern Matching

Routes support dynamic segments:

```javascript
// Pattern: /users/:id
// Matches: /users/123, /users/abc, /users/test-user
// Doesn't match: /users/, /users/123/edit

// Pattern: /blog/:category/:post
// Matches: /blog/tech/my-post
```

**Implementation:**
- `:param` syntax is converted to regex capture groups
- Pattern: `/users/:id` → Regex: `/^\/users\/([a-z0-9-_]+)$/i`
- Case-insensitive matching by default

### Route Registry

All routes are stored in a simple array structure:

```javascript
const listeners = [
  { path: "/", page: homePage },
  { path: "/users/:id", page: userPage },
  { path: "/about", page: aboutPage }
];
```

---

## Architecture Overview

### High-Level Structure

```
┌─────────────────────────────────────────┐
│          Application Layer              │
│       (User's Page Handlers)            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Router Framework Layer          │
│  ┌──────────┐  ┌─────────┐  ┌────────┐ │
│  │ Router   │  │ Handle  │  │Matching│ │
│  └──────────┘  └─────────┘  └────────┘ │
│  ┌──────────┐  ┌─────────┐  ┌────────┐ │
│  │  Params  │  │  Args   │  │ urlFor │ │
│  └──────────┘  └─────────┘  └────────┘ │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Web Platform APIs                  │
│  History API, URL, Location             │
└─────────────────────────────────────────┘
```

### Package Dependencies

```
┌─────────────────────────────────────────┐
│           User Application              │
└───────────────┬─────────────────────────┘
                │
     ┌──────────┴──────────┐
     │                     │
┌────▼──────┐      ┌───────▼────┐
│  Router   │      │   urlFor   │
└─────┬─────┘      └────────────┘
      │
┌─────▼──────┐     ┌──────────┐
│   Handle   │────▶│ Matching │
└─────┬──────┘     └─────┬────┘
      │                  │
┌─────▼──────┐     ┌─────▼────┐
│   Params   │     │Listeners │
└────────────┘     └──────────┘
      │                  │
┌─────▼──────┐     ┌─────▼────┐
│    Args    │     │ Fallback │
└────────────┘     └──────────┘
```

**Key Points:**
- All packages are independent modules
- No circular dependencies
- Tree-shakeable imports
- Minimal coupling

---

## Package Design

### 1. Router Package

**Purpose:** Core routing registration and API

**Structure:**
```
packages/router/
├── index.js           # Re-exports router
├── router.js          # Main router implementation
└── router.spec.js     # Tests
```

**Key Concepts:**

**Chainable API:**
```javascript
export default function router(path, page) {
  listeners.push({ path, page });
  return router; // Return self for chaining
}
```

**Attached Methods:**
```javascript
Object.assign(router, {
  router,      // Self-reference
  fallback,    // Set 404 handler
  handle,      // Match and execute route
});
```

---

### 2. Matching Package

**Purpose:** Pattern matching and route resolution

**Structure:**
```
packages/matching/
├── index.js
├── matching.js
└── matching.spec.js
```

**Algorithm:**

```javascript
const matching = () => {
  return listeners.find(({ path }) => {
    if (!path) return false;

    // Convert :param syntax to regex
    const rule = path.replace(/:\w+/g, "([a-z0-9-_]+)");
    const pattern = new RegExp(`^${rule}$`, "i");

    // Test against current pathname
    return pattern.test(globalThis.location.pathname);
  }) ?? fallback;
};
```

**Features:**
- First-match wins (like Express.js)
- Case-insensitive matching
- Automatic fallback if no match
- Parameter capture via regex groups

---

### 3. Handle Package

**Purpose:** Execute matched route handlers

**Structure:**
```
packages/handle/
├── index.js
├── handle.js
└── handle.spec.js
```

**Execution Flow:**

```javascript
function handle() {
  const { page, path } = matching();
  args();          // Parse query string
  params(path);    // Extract route params
  if (page) page(); // Execute handler
}
```

**Responsibilities:**
1. Find matching route
2. Parse URL parameters
3. Execute page handler

---

### 4. Params Package

**Purpose:** Extract dynamic route parameters

**Structure:**
```
packages/params/
├── index.js
├── params.js
└── params.spec.js
```

**Implementation:**

```javascript
let currentParams = {};

function params(path) {
  if (path) {
    // Set params mode
    const paramNames = (path.match(/:\w+/g) || [])
      .map(p => p.slice(1));

    const rule = path.replace(/:\w+/g, "([a-z0-9-_]+)");
    const pattern = new RegExp(`^${rule}$`, "i");
    const matches = globalThis.location.pathname.match(pattern);

    currentParams = {};
    if (matches) {
      paramNames.forEach((name, i) => {
        currentParams[name] = matches[i + 1];
      });
    }
  } else {
    // Get params mode
    return currentParams;
  }
}
```

**Example:**
```javascript
// Route: /users/:id/posts/:postId
// URL: /users/123/posts/456

params(); // { id: "123", postId: "456" }
```

---

### 5. Args Package

**Purpose:** Parse query string parameters

**Structure:**
```
packages/args/
├── index.js
├── args.js
└── args.spec.js
```

**Implementation:**

```javascript
function args() {
  const params = new URLSearchParams(globalThis.location.search);
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
}
```

**Example:**
```javascript
// URL: /search?q=router&page=2&sort=asc

args(); // { q: "router", page: "2", sort: "asc" }
```

---

### 6. UrlFor Package

**Purpose:** Generate URLs for named routes

**Structure:**
```
packages/urlFor/
├── index.js
├── urlFor.js
└── urlFor.spec.js
```

**Implementation:**

```javascript
const urlFor = (name, params = {}) => {
  const path = listeners.find(
    ({ page }) => page?.name === name
  )?.path;

  if (!path) return "#";

  // Replace :param with actual values
  const pathname = path.replace(
    /:(\w+)/g,
    (_, key) => params[key] ?? `:${key}`
  );

  return `${globalThis.location.origin}${pathname}`;
};
```

**Example:**
```javascript
function userProfile() {
  // Handler implementation
}

router("/users/:id/profile", userProfile);

urlFor("userProfile", { id: 123 });
// → "https://example.com/users/123/profile"
```

---

### 7. Listeners Package

**Purpose:** Route registry storage

**Structure:**
```
packages/listeners/
├── index.js
└── listeners.spec.js
```

**Implementation:**

```javascript
const listeners = [];
export default listeners;
```

**Usage:**
```javascript
// Add route
listeners.push({ path: "/users/:id", page: userPage });

// Find route
const route = listeners.find(({ path }) =>
  pattern.test(path)
);
```

---

### 8. Fallback Package

**Purpose:** 404 handler registry

**Structure:**
```
packages/fallback/
├── index.js
├── fallback.js
└── fallback.spec.js
```

**Implementation:**

```javascript
let fallback = { page: null };

fallback.set = (page) => {
  fallback.page = page;
};

export default fallback;
```

---

### 9. PushState & PopState Packages

**Purpose:** History API wrappers (future use)

**Structure:**
```
packages/pushState/
├── index.js
└── pushState.js

packages/popState/
├── index.js
└── popState.js
```

---

## Data Flow

### Route Registration Flow

```
User defines route
   │
   ▼
router(path, page)
   │
   ▼
listeners.push({ path, page })
   │
   ▼
Route stored in registry
```

### Route Execution Flow

```
User navigates or page loads
   │
   ▼
router.handle() called
   │
   ▼
matching() finds route
   │
   ▼
args() parses query string
   │
   ▼
params(path) extracts parameters
   │
   ▼
page() handler executed
   │
   ▼
User sees new view
```

### URL Generation Flow

```
Call urlFor(name, params)
   │
   ▼
Find route by handler name
   │
   ▼
Replace :params with values
   │
   ▼
Return full URL string
```

---

## Performance Considerations

### 1. Linear Route Matching

**Why:** Simple array `.find()` for route matching

**Impact:**
- ✅ Simple implementation
- ✅ Predictable behavior (first match wins)
- ⚠️ O(n) complexity (linear time)
- ⚠️ Slower with many routes (100+)

**Mitigation:**
- Most apps have < 50 routes
- Matching is very fast (regex test)
- Could optimize with trie data structure if needed

### 2. Regex Pattern Compilation

**Why:** Route patterns compiled to regex on-the-fly

**Impact:**
- ✅ Flexible pattern matching
- ✅ No pre-compilation step needed
- ⚠️ Regex created on each match attempt

**Optimization:**
- Cache compiled patterns (future enhancement)
- Use simpler string matching for exact routes

### 3. Global State

**Why:** Current params stored in module-level variable

**Impact:**
- ✅ Simple API (no context passing)
- ✅ Fast access
- ⚠️ Not SSR-friendly (global state)
- ⚠️ Could cause issues with concurrent requests

**SSR Consideration:**
- For server-side rendering, use context-based approach
- Pass params as function arguments instead

### 4. Tree Shaking

**Why:** Each package is independently importable

**Impact:**
- ✅ Smaller bundle sizes
- ✅ Only pay for what you use
- ✅ Better compression

**Example:**
```javascript
// Only imports router and params
import router, { params } from "@the-memoize-project/router";

// urlFor is tree-shaken away
```

---

## Design Patterns

### 1. Functional Core, Imperative Shell

Core logic is pure functions; side effects at the edges.

### 2. Singleton Pattern

Router instance is a singleton (module-level).

### 3. Chain of Responsibility

Route matching tries each route in order until one matches.

### 4. Strategy Pattern

Each route has its own handler (strategy).

### 5. Factory Pattern

`urlFor()` generates URLs based on route definitions.

### 6. Observer Pattern

`popstate` event observes browser navigation.

---

## Future Roadmap

### Near Term (v0.1-0.5)

- [ ] Route guards/middleware
- [ ] Hash-based routing mode
- [ ] Lazy route loading
- [ ] Route transitions

### Mid Term (v0.6-0.9)

- [ ] Nested route helpers
- [ ] Route metadata
- [ ] SSR-compatible context API
- [ ] Performance optimizations (cached patterns)

### Long Term (v1.0+)

- [ ] Stable 1.0 API
- [ ] Official documentation site
- [ ] Integration examples
- [ ] Enterprise support

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute to the architecture and design of Memoize Router.

---

## References

- [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [URL Pattern API](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API)
- [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

---

**Built with ❤️ by The Memoize Project** 🧭
