# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Failed refresh keeps previous successful in-memory view when available. | Done | Existing retention logic now marks degraded load phase and keeps previous view metadata visible. |
| AC-2 | Dashboard shows source/cache/load phase. | Done | `data-load-phase` chips and `setLoadPhase()` added. |
| AC-3 | Debug surface exposes read-only helpers only. | Done | `debugSnapshot()` returns metadata only with `readOnly: true`; tests assert no browser project-state storage. |
| AC-4 | Performance budget docs exist. | Done | `docs/DASHBOARD_PERFORMANCE_BUDGET.md` added and linked from test strategy/contract. |
| AC-5 | Validation evidence is attached. | Done | Docker sync-build evidence appended with 83 files / 561 tests and built CLI smoke `ok:true`. |
