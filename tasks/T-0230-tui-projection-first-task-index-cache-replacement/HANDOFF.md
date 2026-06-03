# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0230 |
| Status | Closed |
| Last Updated | 2026-06-03 |

## Last Completed

| Item | Evidence |
|---|---|
| Implemented projection-first task list/cache replacement. | `src/tui/read-model.ts`, `src/tui/cache.ts` |
| Focused TUI/CLI/feature smoke passed. | Docker focused Vitest: 6 files / 60 tests |
| Full Docker validation passed. | `npm run dev:docker-sync-build`: 91 files / 595 tests; built CLI smoke `ok:true`. |
| Built `/mnt/f` snapshot smoke improved but did not hit 2s. | 42.56s after T-0229 to 4.05s after T-0230; internal read-model/render about 160 ms. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit T-0230, then start T-0231. | Remaining bottleneck is CLI startup eager imports rather than TUI read-model scans. | T-0230 evidence |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| TUI no longer broad-scans `tasks/` to detect deleted capsule directories. | Stale Task Board/projection rows can stay visible. | Treat as protocol drift; use workflow/doctor validation to repair source-of-truth. |
| If projection and Task Board are both missing, legacy fallback still scans tasks. | Damaged/non-standard workspaces may be slower. | Future hardening can require projection bootstrap or explicit degraded state. |
| Built CLI snapshot still takes about 4s on `/mnt/f`. | T-0230 removed read-model bottlenecks but not CLI startup import cost. | T-0231 should lazy-load TUI command imports or split snapshot entry startup. |
