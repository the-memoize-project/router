# Glossary

> **Complete reference of concepts, patterns, and terminology used throughout @the-memoize-project/router**

## Core Concepts

### Route
A mapping between a URL pattern and a handler function. Routes define how your application responds to different URL paths.

### Route Pattern
A string that defines which URLs a route will match. Can include static segments (`/about`) and dynamic parameters (`/users/:id`).

### Handler
A function that executes when a route matches the current URL. Handlers are responsible for rendering content or performing actions.

### Route Parameter
A dynamic segment in a route pattern, prefixed with `:`. Captures part of the URL path as a named value (e.g., `/users/:id` captures the ID).

### Query String
The portion of a URL after the `?` symbol, containing key-value pairs (e.g., `?page=2&sort=asc`).

### Fallback
A handler that executes when no defined route matches the current URL. Typically used for 404 pages.

---

## Package Overview

### router
The core module providing the chainable API for route registration. Central entry point for the entire library.

**Key Concepts:**
- Route registration (`router(path, handler)`)
- Chainable API (`router("/a", h1)("/b", h2)`)
- Handler attachment (`.handle()`)
- Fallback registration (`.fallback()`)

### params
Extracts dynamic parameters from the current URL based on the matched route pattern.

**Key Concepts:**
- Parameter extraction from URL path
- Named parameter access
- Multiple parameter support

### args
Parses query string parameters from the current URL.

**Key Concepts:**
- Query string parsing
- Key-value extraction
- URL decoding

### urlFor
Generates URLs for named routes with parameter interpolation.

**Key Concepts:**
- Named route lookup
- Parameter substitution
- Full URL generation

### matching
Finds which registered route matches the current URL path.

**Key Concepts:**
- Pattern-to-regex conversion
- First-match-wins strategy
- Fallback handling

### handle
Orchestrates the route handling process: matching, parameter extraction, and handler execution.

**Key Concepts:**
- Route resolution
- Parameter parsing
- Handler invocation

### listeners
Stores all registered routes as an array of path-handler pairs.

**Key Concepts:**
- Route registry
- Linear storage
- First-match ordering

### fallback
Manages the 404 handler for unmatched routes.

**Key Concepts:**
- Default handler storage
- 404 page rendering
- Graceful failure

### pushState
Wrapper around the History API's `pushState` method for programmatic navigation.

**Key Concepts:**
- History stack manipulation
- URL updates without reload
- State preservation

### popState
Handles browser back/forward button navigation via the `popstate` event.

**Key Concepts:**
- Browser navigation events
- History traversal
- State restoration

---

## API Terminology

### Chainable API
An API design where methods return `this` (or the function itself), allowing multiple calls to be chained together:

```javascript
router("/", homePage)
  ("/about", aboutPage)
  ("/contact", contactPage);
```

### Pattern Syntax
The notation used for route patterns:

| Syntax | Example | Matches |
|--------|---------|---------|
| Static | `/about` | Exact path |
| Parameter | `/users/:id` | `/users/123`, `/users/abc` |
| Multiple | `/posts/:category/:slug` | `/posts/tech/my-post` |

### Route Matching
The process of comparing the current URL against registered route patterns to find a match.

### Handler Signature
Handlers are simple functions with no required parameters:

```javascript
function myHandler() {
  // Access params and args as needed
  const { id } = params();
  const { page } = args();
}
```

---

## Web Platform APIs

### History API
Browser API for manipulating the session history. Memoize Router uses:

- `history.pushState(state, title, url)` - Add entry to history
- `history.replaceState(state, title, url)` - Replace current entry
- `popstate` event - Detect back/forward navigation

### Location API
Browser API providing information about the current URL:

- `location.pathname` - The path portion (`/users/123`)
- `location.search` - The query string (`?page=2`)
- `location.origin` - Protocol, host, and port (`https://example.com`)

### URLSearchParams
Browser API for parsing and manipulating query strings:

```javascript
const params = new URLSearchParams("?a=1&b=2");
params.get("a"); // "1"
```

---

## Patterns and Concepts

### Single Page Application (SPA)
An application that loads a single HTML page and dynamically updates content without full page reloads. Memoize Router is designed for SPAs.

### Client-Side Routing
Navigation handled entirely in the browser without server requests. Updates the URL and renders content using JavaScript.

### Hash-Based Routing
Using the URL hash (`#`) for routing (e.g., `example.com/#/about`). Currently planned for future implementation.

### History-Based Routing
Using the History API for clean URLs without hashes (e.g., `example.com/about`). This is Memoize Router's default mode.

### Route Guard
A function that runs before a route handler to check conditions (authentication, permissions). Planned for future implementation.

### Middleware
Functions that intercept route handling to add behavior (logging, analytics, transformations). Planned for future implementation.

---

## Decision Trees

### When to Use Which Function?

```
What do you need?
├─ Register a route → router(path, handler)
├─ Handle current URL → router.handle()
├─ Set 404 handler → router.fallback(handler)
├─ Get route parameters → params()
├─ Get query parameters → args()
└─ Generate URL for route → urlFor(name, params)
```

### Route Pattern Selection

```
What URL structure do you need?
├─ Exact path → "/about"
├─ Single parameter → "/users/:id"
├─ Multiple parameters → "/users/:id/posts/:postId"
├─ Optional segments → (not yet supported)
└─ Wildcards → (not yet supported)
```

---

## Common Patterns

### Basic Route Setup

```javascript
import router from "@the-memoize-project/router";

router("/", homePage)
  ("/about", aboutPage)
  ("/users/:id", userPage)
  .fallback(notFoundPage);

router.handle();
```

### Navigation with Links

```javascript
document.addEventListener("click", (e) => {
  if (e.target.matches("a[href^='/']")) {
    e.preventDefault();
    history.pushState({}, "", e.target.href);
    router.handle();
  }
});
```

### Accessing Parameters

```javascript
import { params, args } from "@the-memoize-project/router";

function userPage() {
  const { id } = params();        // Route parameter
  const { tab } = args();         // Query parameter
  console.log(`User ${id}, tab: ${tab}`);
}
```

### Generating Links

```javascript
import { urlFor } from "@the-memoize-project/router";

function userProfile() {}
router("/users/:id/profile", userProfile);

// Generate URL
const url = urlFor("userProfile", { id: 123 });
// → "https://example.com/users/123/profile"
```

---

## Anti-Patterns

### Don't: Manual URL Parsing

```javascript
// Bad - manual parsing
function userPage() {
  const path = location.pathname;
  const id = path.split("/")[2];
}
```

### Do: Use params()

```javascript
// Good - use the helper
function userPage() {
  const { id } = params();
}
```

### Don't: Inline Handler Logic

```javascript
// Bad - inline handlers
router("/users", () => {
  // 100 lines of code...
});
```

### Do: Named Handler Functions

```javascript
// Good - named functions
function usersPage() {
  // Handler logic
}

router("/users", usersPage);
```

### Don't: Forget to Call handle()

```javascript
// Bad - routes registered but never activated
router("/", homePage)("/about", aboutPage);
// Nothing happens!
```

### Do: Call handle() After Setup

```javascript
// Good - activate routing
router("/", homePage)("/about", aboutPage);
router.handle();  // Activate!
```

---

## Performance Guidelines

### Route Registration

1. **Order matters** - Put frequently accessed routes first
2. **Be specific** - More specific patterns should come before general ones
3. **Limit complexity** - Keep the number of routes reasonable (< 100)

### Navigation Performance

1. **Avoid full page reloads** - Use `pushState` instead
2. **Debounce rapid navigation** - Prevent excessive handler calls
3. **Lazy load views** - Load view code on demand

### Memory Management

1. **Clean up handlers** - Remove event listeners when done
2. **Clear intervals** - Stop timers when navigating away
3. **Cancel pending requests** - Abort fetch calls on navigation

---

## Error Handling

### Route Not Found

```javascript
router.fallback(() => {
  document.body.innerHTML = `
    <h1>404 - Page Not Found</h1>
    <a href="/">Go Home</a>
  `;
});
```

### Invalid Route Parameter

```javascript
function userPage() {
  const { id } = params();
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return notFoundPage();
  }

  // Continue with valid ID
}
```

---

## API Reference Quick Links

- [Complete API Reference](./README.md#-api-reference)
- [Architecture Deep Dive](./ARCHITECTURE.md)
- [Examples & Tutorials](./EXAMPLES.md)
- [Contributing](./CONTRIBUTING.md)
