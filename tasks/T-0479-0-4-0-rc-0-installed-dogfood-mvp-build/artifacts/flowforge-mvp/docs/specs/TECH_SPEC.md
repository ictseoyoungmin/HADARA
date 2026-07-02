# FlowForge Technical Spec

## Runtime

- Node.js built-in HTTP server.
- No runtime npm dependencies.
- File-backed JSON store in `data/flowforge.json`.
- Static browser UI under `public/`.

## Boundaries

- `src/schema.js`: validation, normalization, seed data, and derived fields.
- `src/store.js`: atomic file persistence and query helpers.
- `src/report.js`: readiness and release-health computation.
- `src/server.js`: REST API and static asset server.
- `public/app.js`: client-side state, rendering, editing, import/export, and charts.
- `public/styles.css`: application layout and component styling.
- `test/smoke.js`: end-to-end HTTP smoke test.
