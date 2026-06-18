# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0349 |
| TaskStatus | Done |
| Last Updated | 2026-06-18T09:39:22Z |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Added `extractReleaseReadiness()` to emit `ReleaseCheck` nodes from `docs/RELEASE_READINESS.md` level-2 headings. | `src/context/release-extractors.ts`; `ev:T-0349:95e6ccd6f23244d7b4f5f85e`. |
| Added explicit release-readiness edges for document ownership, known command code-span mentions, and durable evidence id references. | `tests/unit/context-graph-release-extractors.test.ts`; `ev:T-0349:95e6ccd6f23244d7b4f5f85e`. |
| Docker focused context graph tests, Docker full `npm run check`, Docker build/dist refresh, built CLI version smoke, and `git diff --check` passed. | `ev:T-0349:95e6ccd6f23244d7b4f5f85e`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Create/start C1 State Projection and Consistency Diagnostics. | Worker plan places state projection after release readiness extraction and before graph builder/task context report. | `docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md`; `docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md`. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Current `extractAgentHandoff()` only emits known-problem nodes, not active/next task state-source hints. | The next state projection capsule may need to align graph-state extraction with existing `state-projection.ts` handoff parsing. | Treat this as part of state projection compatibility work rather than reopening T-0348. |
