# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Release report/read-model behavior is implemented without publish or registry mutation. | Done | Decomposition moved read-only helpers only; focused release dry-run regression passed. |
| AC-2 | Release boundary docs and schema fixtures are updated when output changes. | Done | No schema output change; release readiness docs note the decomposition boundary. |
| AC-3 | Focused release/schema tests, full Docker check, and built CLI dry-run smoke are recorded. | Done | Focused wrapper passed; Docker sync-build passed 100 files / 660 tests; built release dry-run smoke returned `ok:true`. |
| AC-4 | Evidence is attached. | Done | Evidence `ev:T-0260:8d72c43eceb84befb2a3b196` attached. |
| AC-5 | Handoff is updated. | Done | Project state, development slices, and handoff docs updated. |
