# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs, TUI shared operator spec, and selected TUI/dashboard read-model code. | Done | Project handoff/spec plus `src/tui/read-model.ts`, `src/tui/cache.ts`, `src/tui/snapshot.ts`, and `src/services/dashboard-task-detail.ts` reviewed. |
| 2 | Add selected task dashboard detail aggregate to the TUI read model. | Done | `TuiReadModel.selectedTask.dashboardDetail` and `proof` added. |
| 3 | Prefer shared proof/evidence data in TUI snapshot summary. | Done | Snapshot proof display uses shared selected task proof before Markdown evidence fallbacks. |
| 4 | Run focused and full Docker validation plus built snapshot smoke. | Done | Focused TUI tests passed 4 files / 46 tests; Docker sync-build passed 91 files / 595 tests; built snapshot smoke passed but took 42.56s on `/mnt/f`. |
| 5 | Attach evidence, update docs, close capsule, and commit. | In Progress | Closure and commit pending. |
