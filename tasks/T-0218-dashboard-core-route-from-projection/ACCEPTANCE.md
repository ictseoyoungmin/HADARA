# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `/api/dashboard/core` returns `hadara.dashboard.core.v1`. | Done | `src/services/dashboard-core.ts`; `src/cli/dashboard.ts` route binding. |
| AC-2 | Core route avoids broad Task Capsule scans. | Done | `tests/unit/dashboard-core-route.test.ts` spies on `tasks/` readdir/readFile and expects zero reads. |
| AC-3 | Warm reads use local projection and bypass recomputes cheaply. | Done | Route uses `readDashboardProjection`/`writeDashboardProjection`; test covers projection warm read and `?cache=bypass`. |
| AC-4 | Tests or explicit constraints are recorded. | Done | Focused test file added; host Vitest unavailable and Docker approval limit recorded. |
| AC-5 | Evidence is attached. | Done | Public command evidence attached with `evidence.add-command` at 2026-06-02T03:05:56.005Z. |
| AC-6 | Handoff is updated. | Done | Task handoff records T-0219 as next step; follow-up validation evidence records the later Docker sync-build pass. |
