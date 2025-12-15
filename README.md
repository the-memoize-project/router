<div align="center">

# 🧭 Memoize Router

**Declarative routing system for The Memoize Project. Zero dependencies, fully reactive.**

Part of [**The Memoize Project**](https://github.com/the-memoize-project) — A modern flashcard application with FSRS spaced repetition

[![npm version](https://img.shields.io/npm/v/@the-memoize-project/router.svg?style=flat-square)](https://www.npmjs.com/package/@the-memoize-project/router)
[![npm downloads](https://img.shields.io/npm/dm/@the-memoize-project/router.svg?style=flat-square)](https://www.npmjs.com/package/@the-memoize-project/router)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@the-memoize-project/router?style=flat-square&label=minzip)](https://bundlephobia.com/package/@the-memoize-project/router)
[![CI Status](https://img.shields.io/github/actions/workflow/status/the-memoize-project/router/publish.yml?branch=main&style=flat-square&label=CI)](https://github.com/the-memoize-project/router/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[**Getting Started**](#-quick-start) · [**Documentation**](#-packages) · [**Examples**](#-showcase) · [**Contributing**](CONTRIBUTING.md)

</div>

---

## 📚 About The Memoize Project

**The Memoize Project** is a modern, personal flashcard application designed for effective learning through spaced repetition. Born from a comprehensive architectural refactoring, the project embraces a **micro-repository architecture** where each context is independently maintained and versioned.

### 🎯 Project Context

- **Mission**: Building a powerful flashcard application with cutting-edge spaced repetition algorithms
- **Evolution**: Migrating from Anki's SM-2 algorithm to the more sophisticated **FSRS (Free Spaced Repetition Scheduler)**
- **Architecture**: Modern micro-repo structure with independent, focused modules
- **Organization**: [github.com/the-memoize-project](https://github.com/the-memoize-project)

### 🧩 Repository Purpose

This repository (`router`) provides the **routing system** that powers navigation in the Memoize application. It's designed to be:

- **Lightweight**: Zero dependencies, minimal footprint (~2KB minified)
- **Declarative**: Define routes without imperative navigation code
- **Reactive**: Automatic route matching and parameter extraction
- **Pattern-Based**: Supports dynamic route parameters like `/users/:id`
- **Multi-Platform**: Works in browsers and Cloudflare Workers

The router seamlessly integrates with Web Components and handles all navigation needs for both client-side and edge computing environments.

---

## 🌟 What is Memoize Router?

**Memoize Router** is a lightweight, declarative routing system built for modern web applications. It provides simple but powerful routing capabilities with pattern matching, dynamic parameters, and fallback routes.

### ✨ Key Features

- **🎯 Pattern Matching** - Define routes with dynamic parameters (`/users/:id`)
- **⚡ Zero Dependencies** - Built on native Web APIs (History API, URL)
- **🪶 Ultra Lightweight** - Less than 2KB minified and gzipped
- **🔗 Named Routes** - Generate URLs programmatically with `urlFor()`
- **🎨 Fallback Support** - Handle 404s gracefully
- **🔒 Type Safe** - Full TypeScript definitions included
- **⚙️ Framework Agnostic** - Works with any framework or vanilla JS
- **📦 Tree-Shakeable** - Import only what you need
- **🌐 Multi-Platform** - Browser and Cloudflare Workers support

---

## 🚀 Quick Start

### Installation

```bash
# npm
npm install @the-memoize-project/router

# yarn
yarn add @the-memoize-project/router

# bun
bun add @the-memoize-project/router

# pnpm
pnpm add @the-memoize-project/router
```

### Basic Usage

#### Browser

```javascript
import router from "@the-memoize-project/router/browser";

// Define routes
router("/", homePage)
  ("/about", aboutPage)
  ("/users/:id", userPage)
  .fallback(notFoundPage);

// Handle route changes
router.handle();

// Navigate programmatically
function navigate(path) {
  history.pushState({}, "", path);
  router.handle();
}
```

#### Cloudflare Workers

```javascript
import router from "@the-memoize-project/router/worker";

// Define API routes with HTTP methods
router.get("/api/users/:id", getUser);
router.post("/api/users", createUser);
router.put("/api/users/:id", updateUser);
router.delete("/api/users/:id", deleteUser);

// Route handlers
async function getUser(request, env, ctx) {
  const { id } = params();
  return new Response(JSON.stringify({ id, name: "User " + id }), {
    headers: { "Content-Type": "application/json" }
  });
}

async function createUser(request, env, ctx) {
  const data = await body(request);
  return new Response(JSON.stringify({ success: true, data }), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
}

// Export the fetch handler
export default {
  async fetch(request, env, ctx) {
    return await router.handle(request, env, ctx) ??
      new Response("Not Found", { status: 404 });
  }
};
```

### Listening to Navigation Events (Browser)

```javascript
// Listen for browser back/forward
window.addEventListener("popstate", () => {
  router.handle();
});

// Listen for link clicks
document.addEventListener("click", (e) => {
  if (e.target.matches("a[href^='/']")) {
    e.preventDefault();
    const path = e.target.getAttribute("href");
    history.pushState({}, "", path);
    router.handle();
  }
});
```

### 🌐 CDN Usage

Perfect for prototyping or learning:

```javascript
import router from "https://esm.sh/@the-memoize-project/router";
import { params, urlFor } from "https://esm.sh/@the-memoize-project/router";
```

---

## 📦 API Reference

### Browser Router API

#### `router(path, handler)`

Define a route with a path pattern and handler function.

```javascript
router("/users/:id", userPage)
  ("/about", aboutPage)
  .fallback(notFoundPage);
```

**Parameters:**
- `path` (string) - Route pattern (supports `:param` syntax)
- `handler` (function) - Function to call when route matches

**Returns:** Router instance (chainable)

---

#### `router.handle()`

Match the current URL against registered routes and execute the matching handler.

```javascript
// Call on page load
router.handle();

// Call after navigation
history.pushState({}, "", "/new-path");
router.handle();
```

---

#### `router.fallback(handler)`

Define a fallback handler for unmatched routes (404).

```javascript
router.fallback(() => {
  console.log("404 - Page not found");
});
```

**Parameters:**
- `handler` (function) - Function to call when no route matches

---

### Worker Router API

#### `router.get(path, handler)` / `router.post(path, handler)` / etc.

Define routes for specific HTTP methods (GET, POST, PUT, DELETE).

```javascript
router.get("/api/users/:id", getUser);
router.post("/api/users", createUser);
router.put("/api/users/:id", updateUser);
router.delete("/api/users/:id", deleteUser);
```

**Parameters:**
- `path` (string) - Route pattern (supports `:param` syntax)
- `handler` (async function) - Function to call when route matches
  - Receives `(request, env, ctx)` parameters
  - Must return a `Response` object

**Returns:** Router instance

---

#### `router.handle(request, env, ctx)`

Match the incoming request against registered routes and execute the matching handler.

```javascript
export default {
  async fetch(request, env, ctx) {
    return await router.handle(request, env, ctx) ??
      new Response("Not Found", { status: 404 });
  }
};
```

**Parameters:**
- `request` (Request) - Incoming HTTP request
- `env` (object) - Environment bindings
- `ctx` (ExecutionContext) - Execution context

**Returns:** Promise<Response> or null if no route matched

---

### Helper Functions

#### `params()` (Browser & Worker)

Access route parameters from the current route.

```javascript
// Browser
import { params } from "@the-memoize-project/router/browser";

// Worker
import { params } from "@the-memoize-project/router/worker";

// Route: /users/:id
// URL: /users/123
const { id } = params();
console.log(id); // "123"
```

**Returns:** Object containing route parameters

---

#### `args()` (Browser & Worker)

Access query string parameters from the current URL.

```javascript
// Browser
import { args } from "@the-memoize-project/router/browser";

// Worker
import { args } from "@the-memoize-project/router/worker";

// URL: /search?q=router&page=2
const { q, page } = args();
console.log(q);    // "router"
console.log(page); // "2"
```

**Returns:** Object containing query parameters

---

#### `body(request)` (Worker only)

Parse the request body from a Cloudflare Worker request.

```javascript
import { body } from "@the-memoize-project/router/worker";

async function createUser(request, env, ctx) {
  const data = await body(request);
  console.log(data); // Parsed request body
  return new Response(JSON.stringify({ success: true }));
}
```

**Parameters:**
- `request` (Request) - The incoming HTTP request

**Returns:** Promise<any> - Parsed request body (JSON, form data, or text)

---

#### `urlFor(name, params)` (Browser & Worker)

Generate a URL for a named route with parameters.

```javascript
// Browser
import { urlFor } from "@the-memoize-project/router/browser";

// Worker
import { urlFor } from "@the-memoize-project/router/worker";

// Define named route
function userPage() {}
router("/users/:id", userPage);

// Generate URL
const url = urlFor("userPage", { id: 123 });
console.log(url); // "https://example.com/users/123"
```

**Parameters:**
- `name` (string) - Handler function name
- `params` (object) - Route parameters to interpolate

**Returns:** Full URL string

---

## 🎭 Showcase

### Real-World Examples

#### Single Page Application (Browser)

```javascript
import router, { params } from "@the-memoize-project/router/browser";

// Define routes
router("/", homePage)
  ("/dashboard", dashboardPage)
  ("/users/:id", userDetailPage)
  ("/users/:id/edit", userEditPage)
  .fallback(notFoundPage);

// Initialize
router.handle();

// Listen for navigation
window.addEventListener("popstate", () => router.handle());

function userDetailPage() {
  const { id } = params();
  fetch(`/api/users/${id}`)
    .then(res => res.json())
    .then(user => {
      document.body.innerHTML = `
        <h1>${user.name}</h1>
        <p>Email: ${user.email}</p>
      `;
    });
}
```

---

#### RESTful API with Cloudflare Workers

```javascript
import router, { params, body } from "@the-memoize-project/router/worker";

// Define API routes
router.get("/api/users", listUsers);
router.get("/api/users/:id", getUser);
router.post("/api/users", createUser);
router.put("/api/users/:id", updateUser);
router.delete("/api/users/:id", deleteUser);

// Mock database (use KV, D1, or Durable Objects in production)
const users = new Map([
  [1, { id: 1, name: "Alice", email: "alice@example.com" }],
  [2, { id: 2, name: "Bob", email: "bob@example.com" }],
]);

async function listUsers(request, env, ctx) {
  const userList = Array.from(users.values());
  return new Response(JSON.stringify(userList), {
    headers: { "Content-Type": "application/json" }
  });
}

async function getUser(request, env, ctx) {
  const { id } = params();
  const user = users.get(Number(id));

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  return new Response(JSON.stringify(user), {
    headers: { "Content-Type": "application/json" }
  });
}

async function createUser(request, env, ctx) {
  const data = await body(request);
  const newUser = { id: users.size + 1, ...data };
  users.set(newUser.id, newUser);

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
}

async function updateUser(request, env, ctx) {
  const { id } = params();
  const data = await body(request);
  const user = users.get(Number(id));

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const updatedUser = { ...user, ...data };
  users.set(Number(id), updatedUser);

  return new Response(JSON.stringify(updatedUser), {
    headers: { "Content-Type": "application/json" }
  });
}

async function deleteUser(request, env, ctx) {
  const { id } = params();
  const deleted = users.delete(Number(id));

  if (!deleted) {
    return new Response("User not found", { status: 404 });
  }

  return new Response(null, { status: 204 });
}

export default {
  async fetch(request, env, ctx) {
    return await router.handle(request, env, ctx) ??
      new Response("Not Found", { status: 404 });
  }
};
```

---

#### Nested Routes with Query Parameters (Browser)

```javascript
import router, { params, args } from "@the-memoize-project/router/browser";

router("/blog/:category", blogCategoryPage)
  ("/blog/:category/:post", blogPostPage);

function blogCategoryPage() {
  const { category } = params();
  const { page = 1 } = args(); // Default to page 1

  console.log(`Showing ${category} posts, page ${page}`);
}

function blogPostPage() {
  const { category, post } = params();
  console.log(`Viewing post: ${post} in ${category}`);
}
```

---

#### Named Routes for Link Generation (Browser)

```javascript
import router, { urlFor } from "@the-memoize-project/router/browser";

function userProfile() {
  // Handler implementation
}

router("/users/:id/profile", userProfile);

// Generate links dynamically
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const html = users.map(user => `
  <a href="${urlFor("userProfile", { id: user.id })}">
    ${user.name}
  </a>
`).join("");
```

---

## 🤔 Why Memoize Router?

### Comparison with Other Solutions

| Feature | Memoize Router | React Router | Vue Router | Page.js |
|---------|---------------|--------------|------------|---------|
| **Zero Dependencies** | ✅ | ❌ | ❌ | ❌ |
| **Framework Agnostic** | ✅ | ❌ | ❌ | ✅ |
| **Bundle Size** | ~2KB | ~45KB | ~25KB | ~5KB |
| **TypeScript Support** | ✅ | ✅ | ✅ | ⚠️ |
| **Pattern Matching** | ✅ | ✅ | ✅ | ✅ |
| **Named Routes** | ✅ | ❌ | ✅ | ❌ |
| **No Build Required** | ✅ | ❌ | ❌ | ✅ |

### The Memoize Router Philosophy

**Traditional Approach:**
```javascript
// Complex, imperative routing
const router = new Router();
router.add("/users/:id", {
  onEnter: () => {},
  onExit: () => {},
  middleware: [],
  component: UserPage,
});
router.init();
```

**Memoize Router Approach:**
```javascript
// Simple, declarative routing
router("/users/:id", userPage).handle();
```

---

## 🗺️ Roadmap

- [x] Core routing functionality
- [x] Pattern matching with parameters
- [x] Query string parsing
- [x] Named routes
- [x] TypeScript definitions
- [ ] Hash-based routing
- [ ] Route guards/middleware
- [ ] Nested route helpers
- [ ] Route transitions
- [ ] Official documentation site

---

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Run tests with coverage
bun run test

# Build for production
bun run build

# Lint and format
biome check .

# Auto-fix issues
biome check --write .
```

### Project Structure

```
@the-memoize-project/router/
├── packages/
│   ├── browser/        # Browser-specific implementation
│   │   ├── router/     # Chainable router API
│   │   ├── args/       # Query string parser
│   │   ├── params/     # Route parameter extractor
│   │   ├── urlFor/     # Named route URL generator
│   │   ├── handle/     # Route handler executor
│   │   ├── matching/   # Route pattern matcher
│   │   ├── listeners/  # Route registry (array)
│   │   ├── fallback/   # 404 handler
│   │   ├── pushState/  # History API wrapper
│   │   └── popState/   # Back/forward navigation
│   └── worker/         # Cloudflare Workers implementation
│       ├── router/     # HTTP method router (Proxy-based)
│       ├── args/       # Query string parser
│       ├── params/     # Route parameter extractor
│       ├── urlFor/     # Named route URL generator
│       ├── handle/     # Request handler executor
│       ├── match/      # HTTP method + path matcher
│       ├── listeners/  # Route registry (by HTTP method)
│       └── body/       # Request body parser
├── dist/               # Built output (browser.js, worker.js)
├── types.d.ts          # TypeScript definitions
├── vite.config.js      # Build configuration
└── vitest.config.js    # Test configuration
```

---

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, improving docs, or proposing new features, your help makes Memoize Router better.

**Ways to contribute:**
- 🐛 [Report bugs](https://github.com/the-memoize-project/router/issues/new?template=bug_report.md)
- 💡 [Suggest features](https://github.com/the-memoize-project/router/issues/new?template=feature_request.md)
- 📖 [Improve documentation](CONTRIBUTING.md#documentation)
- 🔧 [Submit pull requests](CONTRIBUTING.md#pull-requests)

Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before getting started.

---

## 📄 License

MIT © The Memoize Project Contributors

See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Memoize Router is inspired by the principles of:
- **History API** - Browser-native navigation
- **URL Pattern Matching** - Declarative route definition
- **Functional Programming** - Composable, predictable functions
- **Minimalism** - Do one thing well

---

## 📚 Resources

- **Documentation:** [Coming Soon]
- **Examples:** [EXAMPLES.md](EXAMPLES.md)
- **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Security:** [SECURITY.md](SECURITY.md)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)
- **Testing:** [TESTING.md](TESTING.md)
- **Glossary:** [GLOSSARY.md](GLOSSARY.md)

---

<div align="center">

**Built with ❤️ for The Memoize Project**

[⭐ Star us on GitHub](https://github.com/the-memoize-project/router) · [💬 Join discussions](https://github.com/the-memoize-project/router/discussions) · [🧠 Learn more about The Memoize Project](https://github.com/the-memoize-project)

</div>
