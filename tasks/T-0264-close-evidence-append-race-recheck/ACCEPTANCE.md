# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Close execute re-reads task evidence immediately before append. | Done | `executeTaskCloseEvidence()` recomputes the write plan before append. |
| AC-2 | A stale same-hash execute report no-ops instead of appending duplicate close evidence. | Done | Regression test covers stale same-hash execute report no-op and duplicate count 0. |
| AC-3 | Changed close proof supersedes behavior is preserved. | Done | Execute recheck reuses existing write-plan helper; supersedes test remains covered. |
| AC-4 | Focused lifecycle tests, full Docker check, and built lifecycle smoke are recorded. | Done | Focused Docker wrapper passed, Docker sync-build passed 100 files / 670 tests, and built `task finish`/`task ready`/`task close`/`task audit-close` passed. |
| AC-5 | Evidence is attached and handoff is updated. | Done | Evidence attached and shared handoff updated to T-0265 next. |
