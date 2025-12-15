# Memoize Router Architecture

This document describes the architecture, design decisions, and internal workings of the Memoize Router.

## Table of Contents

- [Philosophy](#philosophy)
- [Multi-Platform Architecture](#multi-platform-architecture)
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
7. **Multi-Platform** - Single codebase, platform-specific optimizations

---

## Multi-Platform Architecture

Memoize Router supports two distinct runtime environments with tailored implementations:

### Browser Platform

**Purpose:** Client-side routing for Single Page Applications (SPAs)

**Key Features:**
- History API integration (pushState/popState)
- Pattern-based route matching
- Chainable router API
- Fallback handler for 404s
- Simple array-based route registry

**Entry Point:** `@the-memoize-project/router/browser`

**Use Cases:**
- Single Page Applications
- Progressive Web Apps
- Web Components with routing

### Worker Platform

**Purpose:** HTTP routing for Cloudflare Workers at the edge

**Key Features:**
- HTTP method-based routing (GET, POST, PUT, DELETE)
- Request/Response handling
- Proxy-based router API
- Request body parsing
- Method-organized route registry

**Entry Point:** `@the-memoize-project/router/worker`

**Use Cases:**
- RESTful APIs
- Edge computing
- Serverless functions
- API gateways

### Shared Components

Both platforms share core functionality:
- Route parameter extraction (`params()`)
- Query string parsing (`args()`)
- Named route URL generation (`urlFor()`)
- Pattern matching logic

This architecture allows:
1. **Code Reuse** - Shared logic between platforms
2. **Platform Optimization** - Specialized features for each environment
3. **Consistent API** - Similar developer experience across platforms
4. **Tree Shaking** - Import only what you need for your target platform

---

## Core Concepts

### History API as Foundation (Browser)

The browser implementation is built on the native History API:

- **`pushState()`** - Navigate to new routes programmatically
- **`popstate` event** - Detect browser back/forward navigation
- **`location.pathname`** - Current route path
- **`location.search`** - Query string parameters

### Request/Response Model (Worker)

The worker implementation is built on the Fetch API standard:

- **`Request`** - Incoming HTTP request with method, URL, headers, body
- **`Response`** - Outgoing HTTP response
- **`request.method`** - HTTP method (GET, POST, PUT, DELETE)
- **`new URL(request.url)`** - Parse request URL and parameters

### Pattern Matching (Both Platforms)

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

Routes are stored differently depending on the platform:

**Browser Registry (Array):**
```javascript
const listeners = [
  { path: "/", page: homePage },
  { path: "/users/:id", page: userPage },
  { path: "/about", page: aboutPage }
];
```

**Worker Registry (Object by HTTP Method):**
```javascript
const listeners = {
  GET: [
    { path: "/api/users/:id", page: getUser, name: "getUser" }
  ],
  POST: [
    { path: "/api/users", page: createUser, name: "createUser" }
  ],
  PUT: [
    { path: "/api/users/:id", page: updateUser, name: "updateUser" }
  ],
  DELETE: [
    { path: "/api/users/:id", page: deleteUser, name: "deleteUser" }
  ]
};
```

This separation allows the worker to efficiently route based on HTTP method first, then path pattern.

---

## Architecture Overview

### High-Level Structure

**Browser Platform:**
```
┌─────────────────────────────────────────┐
│          Application Layer              │
│         (Page Handlers)                 │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Browser Router Layer               │
│  ┌──────────┐  ┌─────────┐  ┌────────┐ │
│  │ Router   │  │ Handle  │  │Matching│ │
│  │(chainable│  │         │  │        │ │
│  └──────────┘  └─────────┘  └────────┘ │
│  ┌──────────┐  ┌─────────┐  ┌────────┐ │
│  │ Fallback │  │pushState│  │popState│ │
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

**Worker Platform:**
```
┌─────────────────────────────────────────┐
│          Application Layer              │
│      (Request Handlers)                 │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Worker Router Layer                │
│  ┌──────────┐  ┌─────────┐  ┌────────┐ │
│  │ Router   │  │ Handle  │  │ Match  │ │
│  │ (Proxy)  │  │         │  │(HTTP)  │ │
│  └──────────┘  └─────────┘  └────────┘ │
│  ┌──────────┐  ┌─────────┐  ┌────────┐ │
│  │  Body    │  │  Params │  │  Args  │ │
│  └──────────┘  └─────────┘  └────────┘ │
│  ┌──────────┐                           │
│  │  urlFor  │                           │
│  └──────────┘                           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Web Platform APIs                  │
│  Fetch API, Request, Response, URL      │
└─────────────────────────────────────────┘
```

### Package Dependencies

**Browser Platform:**
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
      │
┌─────▼──────┐
│  popState  │
│  pushState │
└────────────┘
```

**Worker Platform:**
```
┌─────────────────────────────────────────┐
│           User Application              │
└───────────────┬─────────────────────────┘
                │
     ┌──────────┴──────────┐
     │                     │
┌────▼──────┐      ┌───────▼────┐
│  Router   │      │   urlFor   │
│  (Proxy)  │      └────────────┘
└─────┬─────┘
      │
┌─────▼──────┐     ┌──────────┐
│   Handle   │────▶│   Match  │
└─────┬──────┘     └─────┬────┘
      │                  │
┌─────▼──────┐     ┌─────▼────┐
│   Params   │     │Listeners │
│    Body    │     │ (by HTTP │
│    Args    │     │  method) │
└────────────┘     └──────────┘
```

**Key Points:**
- All packages are independent modules
- No circular dependencies
- Tree-shakeable imports
- Minimal coupling
- Platform-specific packages (fallback, matching, popState, pushState for browser; match, body for worker)
- Shared packages (params, args, urlFor, listeners, handle, router)

---

## Package Design

### 1. Router Package

**Purpose:** Core routing registration and API

#### Browser Implementation

**Structure:**
```
packages/browser/router/
├── index.js           # Re-exports router
├── router.js          # Main router implementation
└── router.spec.js     # Tests
```

**Chainable API:**
```javascript
import fallback from "@browser/fallback";
import handle from "@browser/handle";
import listeners from "@browser/listeners";

function router(path, page) {
  listeners.push({ path, page });
  return router; // Return self for chaining
}

Object.assign(router, {
  router,      // Self-reference
  fallback,    // Set 404 handler
  handle,      // Match and execute route
});

export default router;
```

**Usage:**
```javascript
router("/", homePage)
  ("/users/:id", userPage)
  .fallback(notFoundPage);
```

#### Worker Implementation

**Structure:**
```
packages/worker/router/
├── index.js           # Re-exports router
├── router.js          # Main router implementation (Proxy-based)
└── router.spec.js     # Tests
```

**Proxy-Based API:**
```javascript
import handle from "../handle/handle.js";
import listeners from "../listeners/listeners.js";

const router = new Proxy(
  {},
  {
    get(_, method) {
      if (/handle/.test(method)) return handle;
      return (path, page) =>
        listeners[method.toUpperCase()].push({ path, page, name: page.name });
    },
  },
);

export default router;
```

**Usage:**
```javascript
router.get("/api/users/:id", getUser);
router.post("/api/users", createUser);
router.put("/api/users/:id", updateUser);
router.delete("/api/users/:id", deleteUser);
```

**Key Difference:** The worker router uses a Proxy to intercept method calls (get, post, put, delete) and automatically organize routes by HTTP method.

---

### 2. Matching/Match Package

**Purpose:** Pattern matching and route resolution

#### Browser Implementation (Matching)

**Structure:**
```
packages/browser/matching/
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
- Matches against `location.pathname`
- First-match wins
- Automatic fallback if no match

#### Worker Implementation (Match)

**Structure:**
```
packages/worker/match/
├── index.js
├── match.js
└── match.spec.js
```

**Algorithm:**
```javascript
const match = (request) => {
  const method = request.method;
  const url = new URL(request.url);

  return listeners[method]?.find(({ path }) => {
    if (!path) return false;

    const rule = path.replace(/:\w+/g, "([a-z0-9-_]+)");
    const pattern = new RegExp(`^${rule}$`, "i");

    return pattern.test(url.pathname);
  });
};
```

**Features:**
- Matches against HTTP method AND path
- Filters by method first for efficiency
- Returns matched route or undefined

**Key Difference:** Worker matches on HTTP method + path, browser only on path.

---

### 3. Handle Package

**Purpose:** Execute matched route handlers

#### Browser Implementation

**Structure:**
```
packages/browser/handle/
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
1. Find matching route via `matching()`
2. Parse URL parameters
3. Execute page handler synchronously

#### Worker Implementation

**Structure:**
```
packages/worker/handle/
├── index.js
├── handle.js
└── handle.spec.js
```

**Execution Flow:**
```javascript
async function handle(request, env, ctx) {
  const route = match(request);
  if (!route) return null;

  const url = new URL(request.url);
  args(url.search);        // Parse query string
  params(route.path, url); // Extract route params

  return await route.page(request, env, ctx);
}
```

**Responsibilities:**
1. Find matching route via `match(request)`
2. Parse URL and query parameters
3. Execute handler asynchronously with (request, env, ctx)
4. Return Response or null

**Key Difference:** Worker handle is async and passes Cloudflare Worker parameters (request, env, ctx) to handlers.

---

### 4. Params Package (Shared)

**Purpose:** Extract dynamic route parameters

**Note:** This package is shared between browser and worker with minor differences in how the pathname is obtained.

**Structure:**
```
packages/browser/params/   # Browser version
packages/worker/params/    # Worker version
```

**Browser Implementation:**
```javascript
let currentParams = {};

function params(path) {
  if (path) {
    const paramNames = (path.match(/:\w+/g) || []).map(p => p.slice(1));
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
    return currentParams;
  }
}
```

**Worker Implementation:** Similar, but extracts pathname from `URL` object instead of `location`.

---

### 5. Args Package (Shared)

**Purpose:** Parse query string parameters

**Structure:**
```
packages/browser/args/     # Browser version
packages/worker/args/      # Worker version
```

**Implementation (both platforms):**
```javascript
function args(search) {
  const params = new URLSearchParams(search || globalThis.location?.search);
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
}
```

---

### 6. UrlFor Package (Shared)

**Purpose:** Generate URLs for named routes

**Structure:**
```
packages/browser/urlFor/   # Browser version
packages/worker/urlFor/    # Worker version
```

**Implementation:** Nearly identical across platforms, searches listeners by handler name and interpolates parameters.

---

### 7. Listeners Package

**Purpose:** Route registry storage

#### Browser Implementation

**Structure:**
```
packages/browser/listeners/
├── index.js
├── listeners.js
└── listeners.spec.js
```

**Implementation:**
```javascript
const listeners = [];
export default listeners;
```

#### Worker Implementation

**Structure:**
```
packages/worker/listeners/
├── index.js
├── listeners.js
└── listeners.spec.js
```

**Implementation:**
```javascript
const listeners = {
  DELETE: [],
  GET: [],
  POST: [],
  PUT: [],
};
export default listeners;
```

**Key Difference:** Worker organizes routes by HTTP method for efficient routing.

---

### 8. Fallback Package (Browser Only)

**Purpose:** 404 handler registry

**Structure:**
```
packages/browser/fallback/
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

### 9. PushState & PopState Packages (Browser Only)

**Purpose:** History API wrappers for navigation

**Structure:**
```
packages/browser/pushState/
├── index.js
└── pushState.js

packages/browser/popState/
├── index.js
└── popState.js
```

**Purpose:** Provides helpers for browser navigation (currently placeholders for future enhancements).

---

### 10. Body Package (Worker Only)

**Purpose:** Parse request body from Cloudflare Worker requests

**Structure:**
```
packages/worker/body/
├── index.js
├── body.js
└── body.spec.js
```

**Implementation:**
```javascript
async function body(request) {
  const contentType = request.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return await request.json();
  } else if (contentType?.includes("application/x-www-form-urlencoded")) {
    const formData = await request.formData();
    return Object.fromEntries(formData);
  } else if (contentType?.includes("multipart/form-data")) {
    const formData = await request.formData();
    return Object.fromEntries(formData);
  } else {
    return await request.text();
  }
}
```

**Features:**
- Automatic content-type detection
- JSON parsing
- Form data parsing
- Text fallback

---

## Data Flow

### Route Registration Flow

**Browser:**
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
Route stored in array
```

**Worker:**
```
User defines route
   │
   ▼
router.get(path, handler)
   │
   ▼
listeners.GET.push({ path, page, name })
   │
   ▼
Route stored in method-specific array
```

### Route Execution Flow

**Browser:**
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
page() handler executed (sync)
   │
   ▼
User sees new view
```

**Worker:**
```
Request arrives at edge
   │
   ▼
router.handle(request, env, ctx) called
   │
   ▼
match(request) finds route (by method + path)
   │
   ▼
args() parses query string
   │
   ▼
params(path) extracts parameters
   │
   ▼
await handler(request, env, ctx)
   │
   ▼
Response returned to client
```

### URL Generation Flow (Both Platforms)

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

**Worker Optimization:** Worker routes are organized by HTTP method first, reducing the search space significantly (only searches routes for the specific HTTP method).

**Mitigation:**
- Most apps have < 50 routes per method
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
