# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Task source signals are tracked. | Done | `DashboardTaskProjectionIndex` records per-task `TASK.md` and `evidence.jsonl` signals. |
| AC-2 | Unchanged task summaries are reused. | Done | Service reuses previous title/status/evidence count when signals match; focused test asserts no task-file rereads on unchanged refresh. |
| AC-3 | Background refresh and core route consume the task projection. | Done | Refresh builds task projection before core; core prefers task projection summaries when present. |
| AC-4 | Tests or explicit constraints are recorded. | Done | Focused test file added; host Vitest unavailable and Docker approval limit recorded. |
| AC-5 | Evidence is attached. | Done | Public command evidence attached with `evidence.add-command` at 2026-06-02T03:23:27.341Z. |
| AC-6 | Handoff is updated. | Done | Task handoff records T-0221 as next step; follow-up validation evidence records the later Docker sync-build pass. |
