# Contributing

- Keep labs self-contained and safe to run locally.
- Do not add target scanning, exploitation, credential harvesting, or external requests.
- Render user-provided strings as text, not HTML.
- Add tests for analysis logic and document educational limitations.
- Keep dependencies at zero unless a dependency has a clear and reviewed benefit.

Run tests with Node.js 20+:

    npm test
