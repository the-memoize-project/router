# Contributing to Memoize Router

First off, thank you for considering contributing to Memoize Router! It's people like you that make Memoize Router such a great tool for building web applications.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Release Process](#release-process)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

**Use this template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Define route '...'
2. Navigate to '....'
3. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Code Example**
```javascript
// Minimal reproduction code
```

**Environment:**
 - OS: [e.g. macOS 14.0]
 - Browser: [e.g. Chrome 120]
 - Router version: [e.g. 0.0.1]
 - Node/Bun version: [e.g. Node 20.0]

**Additional context**
Add any other context about the problem here.
```

**Where to report:**
- 🐛 [Create Bug Report](https://github.com/the-memoize-project/router/issues/new?template=bug_report.md)

---

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

**Use this template:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions or features you've considered.

**Additional context**
Add any other context, code examples, or screenshots about the feature request.

**API Design (if applicable)**
```javascript
// Proposed API usage
```
```

**Where to suggest:**
- 💡 [Request Feature](https://github.com/the-memoize-project/router/issues/new?template=feature_request.md)

---

### Your First Code Contribution

Unsure where to begin? You can start by looking through these issues:

- **Good First Issue** - Issues that are good for newcomers
- **Help Wanted** - Issues that need assistance

**Steps:**

1. **Find an issue** - Look for issues labeled `good first issue` or `help wanted`
2. **Comment** - Let others know you're working on it
3. **Fork** - Fork the repository to your account
4. **Code** - Make your changes
5. **Test** - Ensure all tests pass
6. **Submit** - Open a pull request

---

### Pull Requests

We actively welcome your pull requests! Here's the process:

#### Before You Start

1. **Check existing PRs** - Avoid duplicate work
2. **Open an issue first** - For significant changes, discuss them in an issue
3. **One feature per PR** - Keep PRs focused and manageable

#### PR Process

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/router.git
   cd router
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/my-awesome-feature
   ```

   Branch naming conventions:
   - `feature/description` - New features
   - `fix/description` - Bug fixes
   - `docs/description` - Documentation updates
   - `refactor/description` - Code refactoring
   - `test/description` - Test additions/updates

3. **Install Dependencies**
   ```bash
   bun install
   ```

4. **Make Changes**
   - Follow our [Coding Guidelines](#coding-guidelines)
   - Write or update tests
   - Update documentation as needed

5. **Run Tests**
   ```bash
   bun run test
   ```

6. **Lint Your Code**
   ```bash
   biome check .
   biome check --write .  # Auto-fix issues
   ```

7. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   ```

   See [Commit Message Guidelines](#commit-message-guidelines)

8. **Push to Your Fork**
   ```bash
   git push origin feature/my-awesome-feature
   ```

9. **Open a Pull Request**
   - Go to the [Router repository](https://github.com/the-memoize-project/router)
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template

#### PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement

## Related Issue
Closes #(issue number)

## How Has This Been Tested?
Describe the tests you ran to verify your changes.

- [ ] Test A
- [ ] Test B

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

---

## Development Setup

### Prerequisites

- **Bun** (recommended): [Install Bun](https://bun.sh/)
- **Node.js** 18+ (alternative): [Install Node.js](https://nodejs.org/)
- **Git**: [Install Git](https://git-scm.com/)

### Quick Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/router.git
cd router

# Install dependencies
bun install

# Start development server
bun dev

# Run tests in watch mode
bun run test --watch
```

### Available Commands

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server with HMR |
| `bun run build` | Build all packages for production |
| `bun run test` | Run all tests with coverage |
| `bun run test -- <pattern>` | Run specific tests matching pattern |
| `biome check .` | Lint and format check |
| `biome check --write .` | Auto-fix lint and format issues |

### Editor Setup

We recommend using **VS Code** with these extensions:

- [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) - Linting & Formatting
- [TypeScript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next) - Type checking
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) - Inline errors

**VS Code Settings (.vscode/settings.json):**

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit"
  }
}
```

---

## Project Structure

```
router/
├── packages/
│   ├── router/         # Core router module
│   ├── args/           # Query string parser
│   ├── params/         # Route parameter extractor
│   ├── urlFor/         # Named route URL generator
│   ├── handle/         # Route handler executor
│   ├── matching/       # Route pattern matcher
│   ├── listeners/      # Route registry
│   ├── fallback/       # 404 handler
│   ├── pushState/      # History API wrapper
│   └── popState/       # Back/forward navigation
├── .claude/            # AI assistant configuration
├── dist/               # Built output (gitignored)
├── types.d.ts          # TypeScript definitions
├── vite.config.js      # Build configuration
├── vitest.config.js    # Test configuration
├── biome.json          # Lint/format configuration
└── package.json        # Package manifest
```

### Package Organization

Each package follows this structure:

```
packages/<package-name>/
├── index.js              # Main entry point (re-exports)
├── <feature>.js          # Feature implementation
└── <feature>.spec.js     # Feature tests
```

---

## Coding Guidelines

### JavaScript Style

We use **Biome** for consistent code style. Key conventions:

- **Quotes**: Always use double quotes `"string"`
- **Semicolons**: Always required at statement end
- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Prefer 80 characters, max 100
- **Naming**:
  - `camelCase` for variables and functions
  - `PascalCase` for classes
  - `UPPER_SNAKE_CASE` for constants
  - Private fields: prefix with `#` (e.g., `#value`)

**Example:**

```javascript
// Good
const myVariable = "value";
const MY_CONSTANT = 42;

class MyRouter {
  #routes = [];

  get routes() {
    return this.#routes;
  }
}

// Bad
const my_variable = 'value'  // Wrong quotes, no semicolon
const myConstant = 42        // Should be UPPER_SNAKE_CASE
```

### TypeScript Definitions

While we write JavaScript, we provide TypeScript definitions:

- Add JSDoc comments with type information
- Update `types.d.ts` files when adding new exports
- Ensure types are accurate and helpful

**Example:**

```javascript
/**
 * Defines a route with a path pattern and handler function.
 *
 * @param {string} path - Route pattern (supports :param syntax)
 * @param {Function} handler - Function to call when route matches
 * @returns {Function} Router instance (chainable)
 *
 * @example
 * ```js
 * router("/users/:id", (params) => {
 *   console.log("User ID:", params.id);
 * });
 * ```
 */
export function router(path, handler) {
  // Implementation
}
```

### Error Handling

- Throw meaningful errors with clear messages
- Use custom error classes when appropriate
- Validate inputs and fail fast
- Provide helpful error messages for developers

**Example:**

```javascript
export function router(path, handler) {
  if (!path || typeof path !== "string") {
    throw new TypeError("path must be a non-empty string");
  }

  if (typeof handler !== "function") {
    throw new TypeError("handler must be a function");
  }

  // Continue with implementation
}
```

---

## Testing

We use **Vitest** with **happy-dom** for testing. All code must have tests.

### Test Organization

- Co-locate tests with source: `feature.spec.js`
- One test file per module
- Use descriptive test names
- Group related tests with `describe` blocks

### Writing Tests

**Example test structure:**

```javascript
import { describe, it, expect, beforeEach } from "vitest";
import { myFunction } from "./myFunction.js";

describe("myFunction", () => {
  describe("when given valid input", () => {
    it("should return expected output", () => {
      const result = myFunction("input");
      expect(result).toBe("expected");
    });
  });

  describe("when given invalid input", () => {
    it("should throw an error", () => {
      expect(() => myFunction(null)).toThrow();
    });
  });
});
```

### Coverage Requirements

- **80% minimum** coverage for statements, branches, functions, and lines
- New features must include tests
- Bug fixes must include regression tests

**Run coverage:**

```bash
bun run test --coverage
```

---

## Documentation

Good documentation is crucial! When contributing:

### Code Documentation

- **JSDoc comments** for all public APIs
- Include `@param`, `@returns`, `@example` tags
- Explain *why*, not just *what*

### README Files

When changing functionality:

- [ ] Update JSDoc comments
- [ ] Update README.md
- [ ] Update ARCHITECTURE.md if needed
- [ ] Add to CHANGELOG.md
- [ ] Update EXAMPLES.md if applicable

---

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process or auxiliary tools

### Scope

The scope should specify the package affected:

- `router`
- `params`
- `args`
- `urlFor`
- `matching`
- `handle`

### Examples

```bash
# New feature
git commit -m "feat(router): add middleware support"

# Bug fix
git commit -m "fix(matching): correct regex pattern for nested routes"

# Documentation
git commit -m "docs(readme): add installation instructions"

# Breaking change
git commit -m "feat(router)!: change route registration API

BREAKING CHANGE: router() now requires explicit .handle() call"
```

### Commit Message Hook

We use **commitlint** to enforce these conventions. The pre-commit hook will reject invalid messages.

---

## Release Process

Releases are handled by maintainers. The process is:

1. **Version Bump** - Update `package.json` version
2. **Update CHANGELOG** - Document all changes
3. **Create Tag** - `git tag v0.x.x`
4. **Build** - `bun run build`
5. **Publish** - `npm publish`
6. **GitHub Release** - Create release with notes

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0) - Breaking changes
- **MINOR** (0.1.0) - New features (backward compatible)
- **PATCH** (0.0.1) - Bug fixes (backward compatible)

**Note:** During v0.x.x, APIs may change between minor versions.

---

## Questions?

- 💬 [GitHub Discussions](https://github.com/the-memoize-project/router/discussions) - Ask questions and share ideas
- 🐛 [GitHub Issues](https://github.com/the-memoize-project/router/issues) - Report bugs and request features
- 📖 [Documentation](README.md) - Read the docs

---

## Recognition

All contributors will be recognized! We use [All Contributors](https://allcontributors.org/) to acknowledge everyone who helps make Memoize Router better.

Contributions of all kinds are welcome: code, documentation, design, ideas, and more!

---

**Thank you for contributing to Memoize Router! Your efforts help build a better web platform for everyone.** 🧭
