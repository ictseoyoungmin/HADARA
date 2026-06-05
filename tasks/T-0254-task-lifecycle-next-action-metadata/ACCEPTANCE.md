# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Task ready with `TASK_STATUS_NOT_DONE` emits `finish-first` next action. | Done | `task-ready.test.ts` asserts `finish-first` with `task-local` boundary and worker role. |
| AC-2 | Task close blockers include one primary next action. | Done | `task-close.test.ts` asserts blocked close primary metadata. |
| AC-3 | Audit-close not-closed state recommends `close-first`. | Done | `task-close.test.ts` asserts audit missing close evidence primary action. |
| AC-4 | Next actions include `writeBoundary` and `recommendedActorRole`. | Done | Focused lifecycle tests assert fields across finish/ready/close/audit. |
| AC-5 | No command executes another command. | Done | Implementation only enriches reports; no command orchestration added. |
| AC-6 | Existing schema compatibility remains additive. | Done | Existing schema ids preserved with additive fields; focused schema tests pass. |
| AC-7 | Evidence is attached and handoff/state docs are updated. | Done | T-0254 evidence attached; Project State, Agent Handoff, Development Slices, and capsule handoff updated. |
