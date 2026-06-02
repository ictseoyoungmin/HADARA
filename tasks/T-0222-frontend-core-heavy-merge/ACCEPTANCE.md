# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Frontend authored data layer prefers `/api/dashboard/core`. | Done | `loadLiveRuntime` tries core before bootstrap/status fallback. |
| AC-2 | Heavy sections merge independently. | Done | Debt and timeline load from projection routes and app backfills timeline after core. |
| AC-3 | Offline/degraded and browser storage boundaries are preserved. | Done | Source kind includes projection as live; no storage APIs added. |
| AC-4 | Tests or explicit constraints are recorded. | Done | Static source expectation updated; build/test blocked by missing deps and Docker usage limit recorded. |
| AC-5 | Evidence is attached. | Done | Public command evidence attached with `evidence.add-command` at 2026-06-02T03:38:37.698Z. |
| AC-6 | Handoff is updated. | Done | Task handoff records T-0223 as next step and carries forward static bundle/Docker validation gaps. |
