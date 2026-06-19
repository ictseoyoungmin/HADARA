# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add a dev script instead of a new HADARA CLI command. | Accepted | T-0383 is a validation/hardening capsule; adding public CLI surface would widen contract scope. | `scripts/context-routing-e2e-smoke.mjs` |
| D-2 | Make `fast` the default smoke profile and keep full graph/cache/pack coverage explicit. | Accepted | Mounted probes showed graph/cache/pack can exceed 20s each; default smoke must finish quickly. | Built smoke observations; `--profile full` remains available. |
| D-3 | Treat cache write detection as a hard smoke failure. | Accepted | Read-only/dry-run smoke must preserve the context cache boundary. | Cache fingerprint boundary in report. |
