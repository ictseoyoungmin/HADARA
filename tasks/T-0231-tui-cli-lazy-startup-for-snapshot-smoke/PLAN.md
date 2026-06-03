# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0230 handoff/timing evidence. | Done | T-0230 identified CLI startup imports as the remaining bottleneck. |
| 2 | Lazy-load CLI command handlers in `src/cli/main.ts`. | Done | Top-level handler imports replaced with per-command dynamic imports. |
| 3 | Run focused CLI dispatch validation. | Done | Focused Docker tests passed 8 files / 53 tests. |
| 4 | Run full Docker sync-build and built snapshot timing. | Done | Docker sync-build passed 91 files / 595 tests; built `/mnt/f` snapshot took 1.37s. |
| 5 | Attach evidence, update handoff/docs, and close. | Done | Evidence attached; finish/close/audit next. |
