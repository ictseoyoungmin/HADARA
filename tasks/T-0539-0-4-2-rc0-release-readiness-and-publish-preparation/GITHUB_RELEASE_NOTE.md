# HADARA 0.4.2-rc.0

Release candidate for the post-0.4.1 cleanup line: command-surface reduction, status/read-model performance, init structure, finalize/evidence UX hardening, dead-code cleanup, and fresh-project dogfood.

## Highlights

- Removes retired public command surfaces and command-era dead code after the 0.4.1 cleanup line.
- Keeps `task status` and `task finalize` as the primary lifecycle while stale lifecycle hints now point to current commands.
- Improves selected-task status performance with invocation-local read memoization and keeps top-level status fast by default.
- Splits init implementation internals without changing generated project behavior.
- Hardens `task finalize --execute --auto` against partial finish writes when close blockers remain.
- Adds response-only evidence append-lock diagnostics.
- Fixes session-start docs read-map preview count parity.
- Dogfoods a fresh governed project through init, generated docs review, validation/direct-result recovery, auto finalize, removed-route checks, docs doctor, doctor, schema, and context surfaces.

## Verification Line

- T-0538 refreshed development `dist` with Docker sync-build and passed full Vitest `148 files / 1002 tests`.
- T-0538 fresh `/tmp` dogfood closed toy task `T-0001` as `closed-valid`.
- T-0539 source preparation retargets package metadata and release-facing docs to `0.4.2-rc.0`.

## Boundaries

- npm publish should use the `next` tag for `0.4.2-rc.0`.
- Stable `latest` remains `hadara@0.4.1`.
- Docker image publish, PyPI publish, installer execution, MCP release/package execution, and installed-package recycle are out of this source-preparation capsule.
- After publish, run a separate installed-package recycle capsule against `hadara@next` expected `0.4.2-rc.0`.
