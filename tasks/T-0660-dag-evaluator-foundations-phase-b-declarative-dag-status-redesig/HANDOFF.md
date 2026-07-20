# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0660 |
| Title | DAG evaluator foundations (Phase B: declarative DAG status redesign) |
| Status | Done |
| Created | 2026-07-20T17:16 |
| Updated | 2026-07-20T17:26 |
## Last Completed

| Item | Evidence |
|---|---|
| Added `src/status/dag/` (schema, validator, bounded evaluator with explainable trace) plus a `generic-governed` graph fixture and a parity test showing its has-work-vs-idle routing agrees with `task-selection-status-v2` on active-task, structured-next-work, and idle fixtures. No CLI wiring or behavior change. | ev:T-0660:72af784a35404404b3420ac3, ev:T-0660:a58f5a64381b408c950e1d1d, ev:T-0660:585f054ce2a548cbb1fef53a |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Phase C: add `continuation` to `ProjectCurrentState`, promote it from Task Capsule handoff during `task close`, and read it before `task-selection-status-v2` falls back to `idle`. | This is the actual T-0658-class bug fix (release-scope/continuation loss after close); it does not depend on the DAG evaluator built in this capsule. | `.hadara/local/tmp_plan/status/redesign_candidate/HADARA_Declarative_DAG_Status_Context_Routing_Design.docx` section 1.1, 9, 16.3 step 7; `src/services/project-current-state.ts`; `src/task/task-close.ts`; `src/services/task-selection-status-v2.ts` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
