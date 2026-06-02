# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0220 |
| Status | Done |
| Last Updated | 2026-06-02 |

## Last Completed

| Item | Evidence |
|---|---|
| Added incremental task projection index. | `src/services/dashboard-task-projection.ts` tracks per-task `TASK.md` and `evidence.jsonl` signals and changed/reused ids. |
| Integrated refresh and core route. | Background refresh builds task projection before core; core prefers task projection summaries when present. |
| Added focused tests. | `tests/unit/dashboard-task-projection.test.ts` covers unchanged reuse, changed-task reread, and redacted storage. |
| Updated dashboard docs. | Dashboard contract and test strategy now describe T-0220 task projection semantics. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start T-0221 Timeline / Debt Projection. | Core/task projection infrastructure is in place; next slice should move timeline and debt summaries out of request-time full reads. | `src/services/dashboard-task-projection.ts`, `src/services/dashboard-refresh.ts`, `src/services/dashboard-timeline.ts`, `src/services/operational-debt.ts`, Phase 5.7 spec. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Full Docker sync-build did not run for T-0220 because Docker escalation remains blocked by usage limit. | TypeScript/Vitest regressions may remain until Docker validation is available. | Run `npm run dev:docker-sync-build` before or during T-0221 and include projection/core/refresh/task-projection focused tests. |
| Task projection still scans the task directory and stats task/evidence files. | Very slow mounts may still pay metadata cost during background refresh. | T-0221 should keep heavy timeline/debt work off the request path; future work can optimize discovery if needed. |
