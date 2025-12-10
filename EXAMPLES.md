# Complete Examples

> **Real-world applications demonstrating the full power of @the-memoize-project/router**

## Table of Contents

1. [Basic Single Page Application](#1-basic-single-page-application) - Simple routing setup
2. [Blog with Query Parameters](#2-blog-with-query-parameters) - Pagination and filtering
3. [E-Commerce with Named Routes](#3-e-commerce-with-named-routes) - Dynamic link generation
4. [Dashboard with Nested Routes](#4-dashboard-with-nested-routes) - Complex route hierarchies
5. [Authentication Flow](#5-authentication-flow) - Protected routes pattern

---

## 1. Basic Single Page Application

**Demonstrates:** Route registration, parameter extraction, fallback handling

### Setup

```javascript
import router, { params } from "@the-memoize-project/router";

// Define page handlers
function homePage() {
  document.body.innerHTML = `
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/users/123">User 123</a>
    </nav>
    <main>
      <h1>Welcome Home</h1>
      <p>This is the home page.</p>
    </main>
  `;
}

function aboutPage() {
  document.body.innerHTML = `
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/users/123">User 123</a>
    </nav>
    <main>
      <h1>About Us</h1>
      <p>Learn more about our project.</p>
    </main>
  `;
}

function userPage() {
  const { id } = params();

  document.body.innerHTML = `
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/users/123">User 123</a>
    </nav>
    <main>
      <h1>User Profile</h1>
      <p>Viewing user: <strong>${id}</strong></p>
    </main>
  `;
}

function notFoundPage() {
  document.body.innerHTML = `
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
    <main>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/">Go back home</a>
    </main>
  `;
}

// Register routes
router("/", homePage)
  ("/about", aboutPage)
  ("/users/:id", userPage)
  .fallback(notFoundPage);

// Activate routing
router.handle();

// Handle navigation
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

**Key Takeaways:**
- `router("/path", handler)` registers routes
- `params()` extracts dynamic segments
- `.fallback()` handles 404s
- Event delegation for SPA navigation

---

## 2. Blog with Query Parameters

**Demonstrates:** Query string parsing, pagination, filtering

### Setup

```javascript
import router, { params, args } from "@the-memoize-project/router";

// Mock blog data
const posts = [
  { id: 1, title: "Getting Started", category: "tutorial", date: "2024-01-01" },
  { id: 2, title: "Advanced Routing", category: "tutorial", date: "2024-01-15" },
  { id: 3, title: "Performance Tips", category: "tips", date: "2024-02-01" },
  { id: 4, title: "Best Practices", category: "tips", date: "2024-02-15" },
  { id: 5, title: "Release Notes", category: "news", date: "2024-03-01" },
];

function blogListPage() {
  const { category, page = "1", sort = "date" } = args();
  const pageNum = parseInt(page, 10);
  const perPage = 2;

  // Filter by category
  let filtered = category
    ? posts.filter(p => p.category === category)
    : posts;

  // Sort posts
  filtered = [...filtered].sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    return new Date(b.date) - new Date(a.date);
  });

  // Paginate
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (pageNum - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  // Build pagination links
  const prevPage = pageNum > 1 ? pageNum - 1 : null;
  const nextPage = pageNum < totalPages ? pageNum + 1 : null;

  const buildUrl = (p) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    params.set("page", p);
    if (sort !== "date") params.set("sort", sort);
    return `/blog?${params}`;
  };

  document.body.innerHTML = `
    <nav>
      <a href="/">Home</a>
      <a href="/blog">Blog</a>
    </nav>
    <main>
      <h1>Blog Posts</h1>

      <div class="filters">
        <strong>Category:</strong>
        <a href="/blog">All</a>
        <a href="/blog?category=tutorial">Tutorials</a>
        <a href="/blog?category=tips">Tips</a>
        <a href="/blog?category=news">News</a>

        <strong>Sort:</strong>
        <a href="/blog?sort=date">Date</a>
        <a href="/blog?sort=title">Title</a>
      </div>

      <ul class="posts">
        ${paginated.map(post => `
          <li>
            <a href="/blog/${post.id}">${post.title}</a>
            <span class="category">${post.category}</span>
            <span class="date">${post.date}</span>
          </li>
        `).join("")}
      </ul>

      <div class="pagination">
        ${prevPage ? `<a href="${buildUrl(prevPage)}">Previous</a>` : ""}
        <span>Page ${pageNum} of ${totalPages}</span>
        ${nextPage ? `<a href="${buildUrl(nextPage)}">Next</a>` : ""}
      </div>
    </main>
  `;
}

function blogPostPage() {
  const { id } = params();
  const post = posts.find(p => p.id === parseInt(id, 10));

  if (!post) {
    return notFoundPage();
  }

  document.body.innerHTML = `
    <nav>
      <a href="/">Home</a>
      <a href="/blog">Blog</a>
    </nav>
    <main>
      <article>
        <h1>${post.title}</h1>
        <div class="meta">
          <span class="category">${post.category}</span>
          <span class="date">${post.date}</span>
        </div>
        <p>This is the content of "${post.title}"...</p>
        <a href="/blog">Back to all posts</a>
      </article>
    </main>
  `;
}

function notFoundPage() {
  document.body.innerHTML = `
    <main>
      <h1>404 - Not Found</h1>
      <a href="/">Go Home</a>
    </main>
  `;
}

// Register routes
router("/", () => { window.location.href = "/blog"; })
  ("/blog", blogListPage)
  ("/blog/:id", blogPostPage)
  .fallback(notFoundPage);

router.handle();

// Navigation handlers
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

**Key Takeaways:**
- `args()` parses query string parameters
- Default values with destructuring
- Building URLs with URLSearchParams
- Combining params() and args()

---

## 3. E-Commerce with Named Routes

**Demonstrates:** URL generation with urlFor(), dynamic link creation

### Setup

```javascript
import router, { params, args, urlFor } from "@the-memoize-project/router";

// Mock product data
const products = [
  { id: 1, slug: "laptop-pro", name: "Laptop Pro", price: 999 },
  { id: 2, slug: "wireless-mouse", name: "Wireless Mouse", price: 29 },
  { id: 3, slug: "usb-keyboard", name: "USB Keyboard", price: 49 },
];

const categories = [
  { slug: "electronics", name: "Electronics" },
  { slug: "accessories", name: "Accessories" },
];

// Named handler functions (names used by urlFor)
function productList() {
  const { category } = args();

  document.body.innerHTML = `
    <nav>
      <a href="${urlFor("productList")}">All Products</a>
      ${categories.map(cat => `
        <a href="${urlFor("productList")}?category=${cat.slug}">${cat.name}</a>
      `).join("")}
      <a href="${urlFor("cart")}">Cart</a>
    </nav>
    <main>
      <h1>Products ${category ? `in ${category}` : ""}</h1>
      <div class="products">
        ${products.map(product => `
          <div class="product-card">
            <h2>${product.name}</h2>
            <p>$${product.price}</p>
            <a href="${urlFor("productDetail", { slug: product.slug })}">View Details</a>
          </div>
        `).join("")}
      </div>
    </main>
  `;
}

function productDetail() {
  const { slug } = params();
  const product = products.find(p => p.slug === slug);

  if (!product) {
    return notFoundPage();
  }

  document.body.innerHTML = `
    <nav>
      <a href="${urlFor("productList")}">All Products</a>
      <a href="${urlFor("cart")}">Cart</a>
    </nav>
    <main>
      <article class="product">
        <h1>${product.name}</h1>
        <p class="price">$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <a href="${urlFor("productList")}">Back to Products</a>
      </article>
    </main>
  `;
}

function cart() {
  document.body.innerHTML = `
    <nav>
      <a href="${urlFor("productList")}">Continue Shopping</a>
    </nav>
    <main>
      <h1>Shopping Cart</h1>
      <p>Your cart is empty.</p>
      <a href="${urlFor("checkout")}">Proceed to Checkout</a>
    </main>
  `;
}

function checkout() {
  document.body.innerHTML = `
    <nav>
      <a href="${urlFor("cart")}">Back to Cart</a>
    </nav>
    <main>
      <h1>Checkout</h1>
      <form>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <button type="submit">Complete Order</button>
      </form>
    </main>
  `;
}

function notFoundPage() {
  document.body.innerHTML = `
    <main>
      <h1>Product Not Found</h1>
      <a href="${urlFor("productList")}">Browse Products</a>
    </main>
  `;
}

// Register routes with named handlers
router("/", productList)
  ("/products", productList)
  ("/products/:slug", productDetail)
  ("/cart", cart)
  ("/checkout", checkout)
  .fallback(notFoundPage);

router.handle();

// Navigation
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href^='/'], a[href^='http']");
  if (link && link.href.startsWith(location.origin)) {
    e.preventDefault();
    history.pushState({}, "", link.href);
    router.handle();
  }
});

window.addEventListener("popstate", () => router.handle());
```

**Key Takeaways:**
- `urlFor("handlerName", { params })` generates URLs
- Named functions enable URL generation
- Centralized URL management
- Type-safe link generation

---

## 4. Dashboard with Nested Routes

**Demonstrates:** Complex route hierarchies, nested views, layout patterns

### Setup

```javascript
import router, { params, args } from "@the-memoize-project/router";

// Layout helper
function dashboardLayout(title, content) {
  return `
    <div class="dashboard">
      <aside class="sidebar">
        <nav>
          <a href="/dashboard">Overview</a>
          <a href="/dashboard/users">Users</a>
          <a href="/dashboard/settings">Settings</a>
          <a href="/dashboard/settings/profile">Profile</a>
          <a href="/dashboard/settings/security">Security</a>
        </nav>
      </aside>
      <main class="content">
        <h1>${title}</h1>
        ${content}
      </main>
    </div>
  `;
}

function dashboardHome() {
  document.body.innerHTML = dashboardLayout("Dashboard Overview", `
    <div class="stats">
      <div class="stat">
        <h3>Total Users</h3>
        <p>1,234</p>
      </div>
      <div class="stat">
        <h3>Active Sessions</h3>
        <p>56</p>
      </div>
      <div class="stat">
        <h3>Revenue</h3>
        <p>$12,345</p>
      </div>
    </div>
  `);
}

function usersListPage() {
  const { page = "1", search = "" } = args();

  document.body.innerHTML = dashboardLayout("Users", `
    <div class="toolbar">
      <input type="search" placeholder="Search users..." value="${search}" />
      <a href="/dashboard/users/new">Add User</a>
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>John Doe</td>
          <td>john@example.com</td>
          <td>
            <a href="/dashboard/users/1">View</a>
            <a href="/dashboard/users/1/edit">Edit</a>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jane Smith</td>
          <td>jane@example.com</td>
          <td>
            <a href="/dashboard/users/2">View</a>
            <a href="/dashboard/users/2/edit">Edit</a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      Page ${page}
    </div>
  `);
}

function userDetailPage() {
  const { id } = params();

  document.body.innerHTML = dashboardLayout(`User #${id}`, `
    <div class="user-detail">
      <p><strong>ID:</strong> ${id}</p>
      <p><strong>Name:</strong> User ${id}</p>
      <p><strong>Email:</strong> user${id}@example.com</p>
      <div class="actions">
        <a href="/dashboard/users/${id}/edit">Edit</a>
        <a href="/dashboard/users">Back to List</a>
      </div>
    </div>
  `);
}

function userEditPage() {
  const { id } = params();

  document.body.innerHTML = dashboardLayout(`Edit User #${id}`, `
    <form class="user-form">
      <label>
        Name:
        <input type="text" name="name" value="User ${id}" />
      </label>
      <label>
        Email:
        <input type="email" name="email" value="user${id}@example.com" />
      </label>
      <div class="actions">
        <button type="submit">Save</button>
        <a href="/dashboard/users/${id}">Cancel</a>
      </div>
    </form>
  `);
}

function userNewPage() {
  document.body.innerHTML = dashboardLayout("Add New User", `
    <form class="user-form">
      <label>
        Name:
        <input type="text" name="name" />
      </label>
      <label>
        Email:
        <input type="email" name="email" />
      </label>
      <div class="actions">
        <button type="submit">Create</button>
        <a href="/dashboard/users">Cancel</a>
      </div>
    </form>
  `);
}

function settingsPage() {
  document.body.innerHTML = dashboardLayout("Settings", `
    <div class="settings-menu">
      <a href="/dashboard/settings/profile">Profile Settings</a>
      <a href="/dashboard/settings/security">Security Settings</a>
      <a href="/dashboard/settings/notifications">Notification Settings</a>
    </div>
  `);
}

function profileSettingsPage() {
  document.body.innerHTML = dashboardLayout("Profile Settings", `
    <form class="settings-form">
      <label>
        Display Name:
        <input type="text" name="displayName" value="Admin" />
      </label>
      <label>
        Avatar URL:
        <input type="url" name="avatar" />
      </label>
      <button type="submit">Save Profile</button>
    </form>
  `);
}

function securitySettingsPage() {
  document.body.innerHTML = dashboardLayout("Security Settings", `
    <form class="settings-form">
      <label>
        Current Password:
        <input type="password" name="currentPassword" />
      </label>
      <label>
        New Password:
        <input type="password" name="newPassword" />
      </label>
      <label>
        Confirm Password:
        <input type="password" name="confirmPassword" />
      </label>
      <button type="submit">Update Password</button>
    </form>
  `);
}

function notFoundPage() {
  document.body.innerHTML = dashboardLayout("Not Found", `
    <p>The page you're looking for doesn't exist.</p>
    <a href="/dashboard">Go to Dashboard</a>
  `);
}

// Register routes (order matters - specific before general)
router("/", () => { location.href = "/dashboard"; })
  ("/dashboard", dashboardHome)
  ("/dashboard/users", usersListPage)
  ("/dashboard/users/new", userNewPage)
  ("/dashboard/users/:id", userDetailPage)
  ("/dashboard/users/:id/edit", userEditPage)
  ("/dashboard/settings", settingsPage)
  ("/dashboard/settings/profile", profileSettingsPage)
  ("/dashboard/settings/security", securitySettingsPage)
  .fallback(notFoundPage);

router.handle();

// Navigation
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

**Key Takeaways:**
- Layout functions for consistent UI
- Route order matters (specific first)
- Nested route patterns
- CRUD route organization

---

## 5. Authentication Flow

**Demonstrates:** Protected routes pattern, redirect after login

### Setup

```javascript
import router, { params, args } from "@the-memoize-project/router";

// Simple auth state (in real app, use proper auth)
let isAuthenticated = false;
let currentUser = null;

function requireAuth(handler) {
  return function protectedHandler() {
    if (!isAuthenticated) {
      // Save intended destination
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      history.replaceState({}, "", `/login?returnUrl=${returnUrl}`);
      router.handle();
      return;
    }
    handler();
  };
}

function loginPage() {
  const { returnUrl = "/" } = args();

  if (isAuthenticated) {
    history.replaceState({}, "", decodeURIComponent(returnUrl));
    router.handle();
    return;
  }

  document.body.innerHTML = `
    <main class="auth-page">
      <h1>Login</h1>
      <form id="login-form">
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </main>
  `;

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // Simulate login
    isAuthenticated = true;
    currentUser = { email: e.target.email.value, name: "User" };

    // Redirect to return URL or home
    const destination = decodeURIComponent(returnUrl);
    history.replaceState({}, "", destination);
    router.handle();
  });
}

function registerPage() {
  if (isAuthenticated) {
    history.replaceState({}, "", "/");
    router.handle();
    return;
  }

  document.body.innerHTML = `
    <main class="auth-page">
      <h1>Register</h1>
      <form id="register-form">
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </main>
  `;

  document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // Simulate registration and auto-login
    isAuthenticated = true;
    currentUser = {
      name: e.target.name.value,
      email: e.target.email.value,
    };

    history.replaceState({}, "", "/dashboard");
    router.handle();
  });
}

function logoutAction() {
  isAuthenticated = false;
  currentUser = null;
  history.replaceState({}, "", "/login");
  router.handle();
}

function homePage() {
  document.body.innerHTML = `
    <nav>
      <a href="/">Home</a>
      ${isAuthenticated ? `
        <a href="/dashboard">Dashboard</a>
        <a href="/profile">Profile</a>
        <a href="/logout">Logout</a>
        <span>Welcome, ${currentUser.name}</span>
      ` : `
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      `}
    </nav>
    <main>
      <h1>Welcome to Our App</h1>
      <p>This is a public page.</p>
      ${!isAuthenticated ? `
        <p><a href="/login">Login</a> to access your dashboard.</p>
      ` : `
        <p>Go to your <a href="/dashboard">dashboard</a>.</p>
      `}
    </main>
  `;
}

function dashboardPage() {
  document.body.innerHTML = `
    <nav>
      <a href="/">Home</a>
      <a href="/dashboard">Dashboard</a>
      <a href="/profile">Profile</a>
      <a href="/logout">Logout</a>
    </nav>
    <main>
      <h1>Dashboard</h1>
      <p>Welcome back, ${currentUser.name}!</p>
      <p>This is a protected page.</p>
    </main>
  `;
}

function profilePage() {
  document.body.innerHTML = `
    <nav>
      <a href="/">Home</a>
      <a href="/dashboard">Dashboard</a>
      <a href="/profile">Profile</a>
      <a href="/logout">Logout</a>
    </nav>
    <main>
      <h1>Your Profile</h1>
      <p><strong>Name:</strong> ${currentUser.name}</p>
      <p><strong>Email:</strong> ${currentUser.email}</p>
      <a href="/profile/edit">Edit Profile</a>
    </main>
  `;
}

function notFoundPage() {
  document.body.innerHTML = `
    <nav>
      <a href="/">Home</a>
    </nav>
    <main>
      <h1>404 - Not Found</h1>
      <a href="/">Go Home</a>
    </main>
  `;
}

// Register routes
router("/", homePage)
  ("/login", loginPage)
  ("/register", registerPage)
  ("/logout", logoutAction)
  ("/dashboard", requireAuth(dashboardPage))
  ("/profile", requireAuth(profilePage))
  .fallback(notFoundPage);

router.handle();

// Navigation
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

**Key Takeaways:**
- `requireAuth()` wrapper for protected routes
- Return URL preservation
- Redirect after login
- Auth state management pattern

---

## Pattern Recipes

### Recipe 1: Simple Navigation

```javascript
import router from "@the-memoize-project/router";

router("/", homePage)
  ("/about", aboutPage)
  .fallback(notFoundPage);

router.handle();
```

---

### Recipe 2: Dynamic Parameters

```javascript
import router, { params } from "@the-memoize-project/router";

router("/users/:id", () => {
  const { id } = params();
  console.log("User ID:", id);
});

router("/posts/:category/:slug", () => {
  const { category, slug } = params();
  console.log(`Post: ${category}/${slug}`);
});
```

---

### Recipe 3: Query String Handling

```javascript
import router, { args } from "@the-memoize-project/router";

router("/search", () => {
  const { q, page = "1", sort = "relevance" } = args();
  console.log(`Search: ${q}, Page: ${page}, Sort: ${sort}`);
});
```

---

### Recipe 4: URL Generation

```javascript
import router, { urlFor } from "@the-memoize-project/router";

function userProfile() {}
router("/users/:id/profile", userProfile);

const url = urlFor("userProfile", { id: 123 });
// "https://example.com/users/123/profile"
```

---

### Recipe 5: Event-Based Navigation

```javascript
// Handle all internal links
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[href^='/']");
  if (link) {
    e.preventDefault();
    history.pushState({}, "", link.href);
    router.handle();
  }
});

// Handle browser back/forward
window.addEventListener("popstate", () => router.handle());
```

---

## Learn More

- [Glossary](./GLOSSARY.md) - All concepts explained
- [Architecture](./ARCHITECTURE.md) - Design patterns
- [API Reference](./README.md#-api-reference) - Complete API docs
- [Navigation Guide](./NAVIGATION.md) - Documentation roadmap
