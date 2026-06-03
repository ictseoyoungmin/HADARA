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
| T-0231 completed the remaining startup hardening. | T-0230 left CLI startup imports as the next bottleneck; T-0231 reduced built `/mnt/f` snapshot to 1.37s. | T-0231 evidence |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| TUI no longer broad-scans `tasks/` to detect deleted capsule directories. | Stale Task Board/projection rows can stay visible. | Treat as protocol drift; use workflow/doctor validation to repair source-of-truth. |
| If projection and Task Board are both missing, legacy fallback still scans tasks. | Damaged/non-standard workspaces may be slower. | Future hardening can require projection bootstrap or explicit degraded state. |
| T-0230 alone did not hit the 2s target. | T-0230 removed read-model bottlenecks but left CLI startup import cost. | Resolved by T-0231 lazy CLI handler imports. |
