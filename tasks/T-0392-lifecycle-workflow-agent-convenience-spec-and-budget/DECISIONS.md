# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `finish`, `ready`, `close`, and `audit-close` as canonical lifecycle commands. | Accepted | These commands separate status bookkeeping, readiness proof, close evidence append, and post-close audit. | Spec Purpose |
| D-2 | Add convenience through read-only state APIs first. | Accepted | A normalized phase report reduces agent confusion without adding writes. | Spec Proposed Public Surfaces |
| D-3 | Any high-level execute flow must require a reviewed plan hash. | Accepted | This preserves dry-run-first review and prevents stale all-in-one mutation. | Spec `task finalize` sections |
