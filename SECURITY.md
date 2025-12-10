# Security Policy

## Reporting a Vulnerability

The Memoize Router team takes security seriously. We appreciate your efforts to responsibly disclose your findings and will make every effort to acknowledge your contributions.

### How to Report

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by sending an email to:

**security@the-memoize-project.org**

If you prefer encrypted communication, you can use our PGP key (coming soon).

### What to Include

To help us better understand and resolve the issue, please include as much of the following information as possible:

- **Type of issue** (e.g., open redirect, XSS, path traversal, etc.)
- **Full paths of source file(s)** related to the manifestation of the issue
- **The location of the affected source code** (tag/branch/commit or direct URL)
- **Any special configuration required** to reproduce the issue
- **Step-by-step instructions to reproduce** the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue**, including how an attacker might exploit it

This information will help us triage your report more quickly.

### What to Expect

After you submit a report, here's what will happen:

1. **Acknowledgment** - We will acknowledge receipt of your vulnerability report within **48 hours**.

2. **Investigation** - Our security team will investigate the issue and determine its validity and severity.

3. **Updates** - We will send you regular updates on our progress, at minimum every **5 business days**.

4. **Fix & Disclosure** - Once we have a fix:
   - We will notify you before the public disclosure
   - We will credit you in the security advisory (unless you prefer to remain anonymous)
   - We will coordinate the disclosure timeline with you

### Disclosure Policy

- **Coordinated Disclosure** - We ask that you give us reasonable time to address the issue before publicly disclosing it.
- **Public Disclosure** - We will publicly disclose the vulnerability once a fix is available and has been deployed.
- **Security Advisories** - Security advisories will be published on our [GitHub Security Advisories page](https://github.com/the-memoize-project/router/security/advisories).

### Scope

This security policy applies to the following:

- **In Scope:**
  - The `@the-memoize-project/router` package
  - Official documentation and examples
  - Build tools and dependencies

- **Out of Scope:**
  - Third-party applications using Memoize Router
  - Social engineering attacks
  - Physical attacks
  - Denial of Service (DoS) attacks

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services
- Only interact with accounts you own or with explicit permission from the account holder
- Do not exploit a security issue beyond what is necessary to demonstrate it
- Give us reasonable time to address the issue before any disclosure

We will not pursue legal action against researchers who follow these guidelines.

### Recognition

We believe in recognizing the efforts of security researchers:

- **Hall of Fame** - We maintain a Security Researchers Hall of Fame (coming soon)
- **Credits** - Security researchers will be credited in:
  - Security advisories
  - Release notes
  - Our documentation (with their permission)

### Supported Versions

We support security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: Current release |
| < 0.0.1 | :x: Please upgrade |

**Note:** During the 0.x.x development phase, only the latest minor version receives security updates.

### Security Best Practices for Users

When using Memoize Router in your projects:

1. **Keep Dependencies Updated**
   ```bash
   # Check for updates
   npm outdated @the-memoize-project/router

   # Update to latest
   npm update @the-memoize-project/router
   ```

2. **Use Package Lock Files**
   - Commit `package-lock.json`, `yarn.lock`, or `bun.lockb`
   - This ensures consistent dependency versions

3. **Review Security Advisories**
   - Watch our [Security Advisories](https://github.com/the-memoize-project/router/security/advisories)
   - Enable GitHub security alerts for your repositories

4. **Validate Route Parameters**
   - Always validate user input from route parameters
   - Sanitize parameters before using in database queries
   - Be cautious with dynamic route generation

5. **Secure Navigation**
   - Validate redirect destinations
   - Avoid open redirect vulnerabilities
   - Use allowlists for external redirects

### Known Security Considerations

#### Route Parameter Injection

When using route parameters:

- Validate parameter values before processing
- Don't trust parameters from untrusted sources
- Use type coercion appropriately

**Unsafe:**
```javascript
// Route: /users/:id
function userPage() {
  const { id } = params();
  // Directly using in SQL query - vulnerable to injection
  db.query(`SELECT * FROM users WHERE id = ${id}`);
}
```

**Safer:**
```javascript
// Route: /users/:id
function userPage() {
  const { id } = params();
  // Validate and use parameterized query
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return notFound();
  db.query("SELECT * FROM users WHERE id = ?", [numericId]);
}
```

#### Open Redirect Prevention

When implementing redirects:

- Validate redirect URLs against an allowlist
- Use relative paths when possible
- Avoid redirecting to user-controlled URLs

**Unsafe:**
```javascript
// Vulnerable to open redirect
function handleLogin() {
  const { returnUrl } = args();
  window.location.href = returnUrl; // Could redirect to malicious site
}
```

**Safer:**
```javascript
// Protected against open redirect
function handleLogin() {
  const { returnUrl } = args();
  // Only allow relative paths or same-origin URLs
  if (returnUrl?.startsWith("/") && !returnUrl.startsWith("//")) {
    window.location.href = returnUrl;
  } else {
    window.location.href = "/dashboard";
  }
}
```

#### Query String Handling

When processing query parameters:

- Validate and sanitize all query values
- Be cautious with array or object-like parameters
- Encode values before displaying in HTML

### Resources

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Web Security Basics](https://developer.mozilla.org/en-US/docs/Web/Security)
- [URL Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)

### Questions?

If you have questions about this security policy, please open a discussion on our [GitHub Discussions](https://github.com/the-memoize-project/router/discussions) page.

---

**Thank you for helping keep Memoize Router and our users safe!**
