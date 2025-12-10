# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of Memoize Router
- **Core Router Module** - Declarative route registration with chainable API
- **Pattern Matching** - Support for dynamic route parameters (`:param` syntax)
- **Query String Parsing** - `args()` helper for URL query parameters
- **Route Parameters** - `params()` helper for extracting route parameters
- **Named Routes** - `urlFor()` for generating URLs programmatically
- **Fallback Handler** - 404 handling for unmatched routes
- **History API Integration** - `pushState` and `popState` wrappers
- ARCHITECTURE.md for architectural documentation
- CONTRIBUTING.md for contribution guidelines
- CHANGELOG.md for tracking changes
- SECURITY.md for security policies
- TESTING.md for testing guidelines
- GLOSSARY.md for terminology reference
- NAVIGATION.md for documentation navigation
- EXAMPLES.md for usage examples
- Full TypeScript definitions

### Documentation
- Professional README with comprehensive feature showcase
- Complete API reference documentation
- Real-world usage examples
- Architecture deep dive

## [0.0.1] - 2024-XX-XX

### Summary
Initial development release with core routing functionality.

### Packages
- `@the-memoize-project/router` - Core router module
- `args` - Query string parser
- `params` - Route parameter extractor
- `urlFor` - Named route URL generator
- `handle` - Route handler executor
- `matching` - Route pattern matcher
- `listeners` - Route registry
- `fallback` - 404 handler
- `pushState` - History API wrapper
- `popState` - Back/forward navigation

### Features
- Pattern matching with dynamic parameters
- Query string parsing
- Named route URL generation
- Chainable route registration API
- Fallback route handling
- TypeScript definitions

### Testing
- Vitest with happy-dom
- Comprehensive test suite

### Build
- Vite for bundling
- Dual format output (ESM + CommonJS)
- Tree-shakeable modules

---

## Release Types

### Major Releases (x.0.0)
Breaking changes that require migration.

### Minor Releases (0.x.0)
New features, backward compatible (during 0.x, APIs may change).

### Patch Releases (0.0.x)
Bug fixes, backward compatible.

---

## Migration Guides

### Future Migrations
Migration guides will be added here when breaking changes are introduced.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to suggest changes and improvements.

---

[Unreleased]: https://github.com/the-memoize-project/router/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/the-memoize-project/router/releases/tag/v0.0.1
