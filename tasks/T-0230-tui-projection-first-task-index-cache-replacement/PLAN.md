# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0228/T-0229 handoff. | Done | AGENTS required-reading context plus active capsule files reviewed. |
| 2 | Replace TUI task list and cache index with projection-first summaries. | Done | `src/tui/read-model.ts`, `src/tui/cache.ts`. |
| 3 | Route snapshot smoke through fast read model. | Done | `src/cli/tui.ts`, `src/services/feature-smoke.ts`. |
| 4 | Run focused TUI/CLI/feature-smoke validation. | Done | Focused Docker Vitest passed 6 files / 60 tests. |
| 5 | Run full Docker sync-build and built `/mnt/f` snapshot timing. | Done | Docker sync-build passed 91 files / 595 tests; built snapshot smoke took 4.05s. |
| 6 | Attach evidence, finish/close/audit, and update handoff/docs. | Done | Evidence attached; finish/ready/close passed; audit-close next. |
