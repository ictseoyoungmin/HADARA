# T-0297 0.3.0-rc.0 prepublish cleanup and final readiness

## Metadata

| Field | Value |
|---|---|
| ID | T-0297 |
| Title | 0.3.0-rc.0 prepublish cleanup and final readiness |
| Status | Done |
| Created | 2026-06-11 |
| Updated | 2026-06-11 |

## Goal

| Goal | Notes |
|---|---|
| Prepublish cleanup and final readiness | Apply reviewer feedback that blocks a clean `hadara@0.3.0-rc.0` npm package page, remove duplicate Phase 7 bundle docs, refresh release evidence, and leave the operator with exact manual publish instructions. |

## Scope

| In Scope | Reason |
|---|---|
| README package-facing install/status text | npm packages include `README.md`, so install examples must target `hadara@0.3.0-rc.0`. |
| Package search metadata | `package.json` should expose accurate description, keywords, repository, homepage, and issue links for npm package discovery. |
| README primary lifecycle clarification | Keep `task complete` out of the primary close path and document it as optional read-only compression. |
| T-0296 stale handoff correction | T-0296 is already closed; its task-local handoff must not claim pending close. |
| Duplicate Phase 7 bundle cleanup | Keep canonical specs under `docs/specs/0.3.0/` and remove copied bundle duplicates. |
| Final readiness validation | Rebuild, smoke package/clean checkout, refresh release artifact evidence, and run release dry-run/publish dry-run without external mutation. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish | Operator-only external mutation after this capsule. |
| GitHub Release creation | Optional operator-only mutation after npm publish. |
| Docker image publishing | Deferred. |
| Token loading or secret capture | Never written to repository files or public evidence. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
<!-- hadara:managed:end task-status-history -->
| 2026-06-11 | Done | Finished task capsule. | `hadara task finish --execute` |
