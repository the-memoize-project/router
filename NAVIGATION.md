# Navigation Guide

> **Your roadmap to mastering @the-memoize-project/router - A complete knowledge graph**

## Quick Start Paths

### I'm brand new to Memoize Router
1. Start with [README](./README.md) - Project overview
2. Read [GLOSSARY](./GLOSSARY.md) - Understand core concepts
3. Follow [Basic SPA Example](./EXAMPLES.md#1-basic-single-page-application)
4. Explore [Architecture](./ARCHITECTURE.md)

### I want to set up routing quickly
1. [Installation](./README.md#installation)
2. [Basic Usage](./README.md#basic-usage)
3. [Listening to Navigation Events](./README.md#listening-to-navigation-events)

### I need to understand the API
1. [router()](./README.md#routerpath-handler) - Route registration
2. [params()](./README.md#params) - Route parameters
3. [args()](./README.md#args) - Query parameters
4. [urlFor()](./README.md#urlforname-params) - URL generation

### I want to contribute
1. [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
2. [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) - Community standards
3. [TESTING.md](./TESTING.md) - Testing patterns
4. [ARCHITECTURE.md](./ARCHITECTURE.md) - Internal design

---

## Core Documentation

### Essential Reading
- [README.md](./README.md) - Project introduction and quick start
- [GLOSSARY.md](./GLOSSARY.md) - Complete terminology reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Design patterns and philosophy
- [EXAMPLES.md](./EXAMPLES.md) - Complete working applications
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute
- [CHANGELOG.md](./CHANGELOG.md) - Version history

---

## Package Index

> **Note:** Memoize Router has a multi-platform architecture with separate implementations for **Browser** and **Cloudflare Workers**.

### Browser Packages (`packages/browser/`)

#### [router](./packages/browser/router/)
**Chainable routing module for SPAs**

- Route registration with chainable syntax
- Handler management
- Fallback support for 404s

---

#### [matching](./packages/browser/matching/)
**Route pattern matcher**

- Regex-based matching
- Parameter pattern conversion
- First-match-wins strategy

---

#### [fallback](./packages/browser/fallback/)
**404 handler management**

- Default handler storage
- Not-found page support

---

#### [pushState](./packages/browser/pushState/)
**History API wrapper**

- Programmatic navigation
- History stack management

---

#### [popState](./packages/browser/popState/)
**Back/forward navigation**

- Browser navigation events
- History traversal

---

### Worker Packages (`packages/worker/`)

#### [router](./packages/worker/router/)
**Proxy-based HTTP router for Cloudflare Workers**

- HTTP method routing (GET, POST, PUT, DELETE)
- Handler management by method

---

#### [match](./packages/worker/match/)
**HTTP method + path matcher**

- Method-first routing
- Path pattern matching
- Efficient route lookup

---

#### [body](./packages/worker/body/)
**Request body parser**

- JSON parsing
- Form data extraction
- Content-type detection

---

### Shared Packages

These packages exist in both `packages/browser/` and `packages/worker/` with minor platform-specific differences:

#### params
**Route parameter extraction**

- Dynamic parameter capture (`:id` syntax)
- Multiple parameter support
- Getter/setter pattern

---

#### args
**Query string parsing**

- URLSearchParams-based
- Key-value extraction
- URL decoding

---

#### urlFor
**Named route URL generation**

- Route lookup by handler name
- Parameter interpolation
- Full URL construction

---

#### handle
**Route handler executor**

- Route resolution
- Parameter setup
- Handler invocation

---

#### listeners
**Route registry**

- Route storage
- Browser: Linear array
- Worker: Organized by HTTP method

---

## Concept Map

### Route Registration Flow

**Browser:**
```
1. Import router
   ↓
   import router from "@the-memoize-project/router/browser"
   ↓
2. Register routes
   ↓
   router("/", homePage)("/about", aboutPage)
   ↓
3. Set fallback
   ↓
   .fallback(notFoundPage)
   ↓
4. Activate routing
   ↓
   router.handle()
   ↓
5. Listen for navigation
   ↓
   window.addEventListener("popstate", () => router.handle())
```

**Worker:**
```
1. Import router
   ↓
   import router from "@the-memoize-project/router/worker"
   ↓
2. Register HTTP routes
   ↓
   router.get("/api/users/:id", getUser)
   router.post("/api/users", createUser)
   ↓
3. Handle incoming requests
   ↓
   export default {
     async fetch(request, env, ctx) {
       return await router.handle(request, env, ctx) ??
         new Response("Not Found", { status: 404 })
     }
   }
```

### URL Matching Flow

```
User navigates to URL
    │
    ├── URL: /users/123?tab=settings
    │
    ↓
router.handle() called
    │
    ↓
matching() finds route
    │
    ├── Pattern: /users/:id
    │
    ↓
params() extracts parameters
    │
    ├── { id: "123" }
    │
    ↓
args() extracts query string
    │
    ├── { tab: "settings" }
    │
    ↓
Handler executed
    │
    └── userPage() called
```

### URL Generation Flow

```
Need to create a link
    │
    ↓
urlFor(name, params)
    │
    ├── name: "userProfile"
    ├── params: { id: 123 }
    │
    ↓
Find route by handler name
    │
    ├── Pattern: /users/:id/profile
    │
    ↓
Replace :params with values
    │
    ├── /users/123/profile
    │
    ↓
Return full URL
    │
    └── https://example.com/users/123/profile
```

---

## Pattern Library

### Pattern: Basic Route Setup (Browser)

```javascript
import router, { params } from "@the-memoize-project/router/browser";

router("/", homePage)
  ("/about", aboutPage)
  ("/users/:id", userPage)
  .fallback(notFoundPage);

router.handle();

function userPage() {
  const { id } = params();
  console.log("User ID:", id);
}
```

**Uses:**
- router() - Route registration
- params() - Parameter extraction
- .fallback() - 404 handling
- .handle() - Activation

---

### Pattern: RESTful API Routes (Worker)

```javascript
import router, { params, body } from "@the-memoize-project/router/worker";

router.get("/api/users/:id", async (request, env, ctx) => {
  const { id } = params();
  return new Response(JSON.stringify({ id }), {
    headers: { "Content-Type": "application/json" }
  });
});

router.post("/api/users", async (request, env, ctx) => {
  const data = await body(request);
  return new Response(JSON.stringify({ success: true, data }), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
});

export default {
  async fetch(request, env, ctx) {
    return await router.handle(request, env, ctx) ??
      new Response("Not Found", { status: 404 });
  }
};
```

**Uses:**
- router.get/post/put/delete() - HTTP method routing
- params() - Parameter extraction
- body() - Request body parsing
- router.handle() - Request handling

---

### Pattern: Navigation Links (Browser)

```javascript
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href^='/']");
  if (link) {
    e.preventDefault();
    history.pushState({}, "", link.href);
    router.handle();
  }
});

window.addEventListener("popstate", () => router.handle());
```

**Uses:**
- Event delegation
- History API
- router.handle()

---

### Pattern: Query Parameters (Both Platforms)

```javascript
// Browser
import { args } from "@the-memoize-project/router/browser";

// Worker
import { args } from "@the-memoize-project/router/worker";

function searchPage() {
  const { q, page = "1", sort = "relevance" } = args();
  console.log(`Search: "${q}", Page: ${page}, Sort: ${sort}`);
}
```

**Uses:**
- args() - Query extraction
- Default values

---

### Pattern: Named Routes (Both Platforms)

```javascript
// Browser
import router, { urlFor } from "@the-memoize-project/router/browser";

// Worker
import router, { urlFor } from "@the-memoize-project/router/worker";

function userProfile() {}
function postDetail() {}

router("/users/:id/profile", userProfile)
  ("/posts/:slug", postDetail);

// Generate links
const profileUrl = urlFor("userProfile", { id: 123 });
const postUrl = urlFor("postDetail", { slug: "hello-world" });
```

**Uses:**
- urlFor() - URL generation
- Named handlers

---

## Find By Use Case

### Route Setup
- Register routes → [router()](./README.md#routerpath-handler)
- Set 404 page → [.fallback()](./README.md#routerfallbackhandler)
- Activate routing → [.handle()](./README.md#routerhandle)

### URL Data
- Get path parameters → [params()](./README.md#params)
- Get query parameters → [args()](./README.md#args)
- Generate URLs → [urlFor()](./README.md#urlforname-params)

### Navigation
- Programmatic navigation → History API + handle()
- Browser back/forward → popstate event
- Link clicks → Event delegation

### Architecture
- How matching works → [ARCHITECTURE.md](./ARCHITECTURE.md#pattern-matching)
- Data flow → [ARCHITECTURE.md](./ARCHITECTURE.md#data-flow)
- Design patterns → [ARCHITECTURE.md](./ARCHITECTURE.md#design-patterns)

---

## Learning Paths

### Beginner Path (1-2 hours)
1. Read [README](./README.md) (15 min)
2. Study [GLOSSARY](./GLOSSARY.md) (30 min)
3. Build [Basic SPA](./EXAMPLES.md#1-basic-single-page-application) (45 min)

### Intermediate Path (3-4 hours)
1. Complete Beginner Path
2. Learn [Query Parameters](./EXAMPLES.md#2-blog-with-query-parameters) (30 min)
3. Learn [Named Routes](./EXAMPLES.md#3-e-commerce-with-named-routes) (30 min)
4. Read [Architecture](./ARCHITECTURE.md) (60 min)

### Advanced Path (5-6 hours)
1. Complete Intermediate Path
2. Study [Testing Patterns](./TESTING.md) (60 min)
3. Explore [Package Design](./ARCHITECTURE.md#package-design) (60 min)
4. Contribute to [project](./CONTRIBUTING.md) (ongoing)

---

## Most Important Concepts

If you only learn 5 things, learn these:

1. **[router()](./README.md#routerpath-handler)** - Register routes
2. **[.handle()](./README.md#routerhandle)** - Activate routing
3. **[params()](./README.md#params)** - Get route parameters
4. **[args()](./README.md#args)** - Get query parameters
5. **[.fallback()](./README.md#routerfallbackhandler)** - Handle 404s

These 5 concepts cover 90% of everyday usage.

---

## Troubleshooting

### "My routes don't work"
1. Did you call `router.handle()`? → Required to activate
2. Is your pattern correct? → `/users/:id` not `/users/{id}`
3. Are routes in the right order? → More specific first

### "Parameters are empty"
1. Does your pattern have `:param`? → Required for extraction
2. Did you call `params()` without arguments? → Getter mode
3. Is the URL matching the pattern? → Check browser URL

### "Query parameters not working"
1. Is there a `?` in the URL? → Required for query string
2. Are you using `args()` not `params()`? → Different functions
3. Check URL encoding → Special characters need encoding

### "Navigation doesn't update the view"
1. Are you calling `router.handle()` after navigation?
2. Did you set up the popstate listener?
3. Are you using `pushState` correctly?

### "404 page not showing"
1. Did you call `.fallback(handler)`? → Required
2. Is the fallback set before `.handle()`?
3. Is your fallback handler defined correctly?

---

## Get Help

- [GitHub Issues](https://github.com/the-memoize-project/router/issues)
- [Discussions](https://github.com/the-memoize-project/router/discussions)
- [Contributing Guide](./CONTRIBUTING.md)

---

**Last Updated:** 2024-12
**Version:** 1.0.0
