# Context

T-0141 intentionally stopped at release publish readiness. It did not make the package publishable because the root metadata was still bootstrap/private: `version: 0.0.0-bootstrap` and `private: true`.

This capsule performs the next package metadata transition only:

- `version` becomes `0.1.0-rc.0`.
- `private` becomes `false`.
- `files` is limited to `dist/`, `README.md`, `LICENSE`, and `package.json`.
- Fresh release evidence is regenerated after the metadata transition.

This capsule does not introduce a mutation-capable release runner. `hadara release publish --mode dry-run --json` remains a readiness and approval audit surface, not an `npm publish` executor.
