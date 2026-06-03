# T-0231 TUI CLI Lazy Startup for Snapshot Smoke

## Metadata

| Field | Value |
|---|---|
| ID | T-0231 |
| Title | TUI CLI Lazy Startup for Snapshot Smoke |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| Bring built `/mnt/f` `hadara tui --snapshot` smoke under 2 seconds. | T-0230 reduced TUI read-model/render to about 160 ms, leaving CLI startup eager imports as the bottleneck. |

## Scope

| In Scope | Reason |
|---|---|
| Lazy-load CLI command handlers from `main.ts`. | `tui --snapshot` should not import dashboard/task/release/smoke modules before dispatching. |
| Preserve existing command behavior. | Dynamic imports must keep normal command dispatch, JSON error handling, and async command support intact. |
| Validate full build/test and built snapshot timing. | Performance target must be proven against `dist/cli/main.js` on `/mnt/f`. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| TUI read-model optimization. | Completed in T-0230. |
| Dashboard refresh or projection work. | Dashboard work remains paused. |
| New TUI feature behavior. | This capsule only changes CLI startup/import timing. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | hadara task create |
| 2026-06-03 | In Progress | Scope fixed to CLI lazy imports for built snapshot startup. | Task capsule update |
| 2026-06-03 | Done | Finished task capsule. | `hadara task finish --execute` |

