# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Timeline/debt projection materialization exists. | Done | `refreshDashboardHeavyProjections` writes timeline overview and debt summary projections. |
| AC-2 | Projection-first heavy routes exist. | Done | `/api/dashboard/timeline` and `/api/dashboard/debt` read local projections or return missing warnings. |
| AC-3 | Heavy projection metadata is exposed. | Done | Projection status reports timeline/debt presence without cached bodies. |
| AC-4 | Tests or explicit constraints are recorded. | Done | Focused test file added; host Vitest unavailable and Docker approval limit recorded. |
| AC-5 | Evidence is attached. | Done | Public command evidence attached with `evidence.add-command` at 2026-06-02T03:31:14.863Z. |
| AC-6 | Handoff is updated. | Done | Task handoff records T-0222 as next step; follow-up validation evidence records the later Docker sync-build pass. |
