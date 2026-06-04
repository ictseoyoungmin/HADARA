# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Package smoke default network policy is `environment-inherited` with `enforced:false`. | Accepted | HADARA does not enforce OS-level network isolation for local tooling. | User attached notes. |
| D-2 | `--network-policy offline` is reported as `offline-best-effort` with `enforced:false`. | Accepted | Python can pass build/pip offline-oriented flags, but this is not a hard network sandbox. | User attached notes. |
| D-3 | Python local package-smoke evidence remains advisory and must not satisfy npm release evidence gates. | Accepted | npm remains the active primary release target. | User attached notes and release readiness docs. |
