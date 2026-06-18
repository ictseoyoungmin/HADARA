# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0344 |
| TaskStatus | Done |
| Last Updated | 2026-06-18 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Added the shared context graph extractor contract with extractor names, extraction context, deterministic source hashing, node/edge id helpers, empty/merged result helpers, and graph extraction summaries. | `src/context/extractor-contract.ts`; `ev:T-0344:567e18dd540c4ea085934770`. |
| Added focused tests for path normalization, deterministic ids, source hashing order independence, source refs, edge ids, merge deduplication, summary counts, and degraded summary behavior. | `tests/unit/context-graph-extractor-contract.test.ts`; `ev:T-0344:567e18dd540c4ea085934770`. |
| Docker focused tests, Docker full `npm run check`, Docker build/dist refresh, built CLI version smoke, and `git diff --check` passed. | `ev:T-0344:567e18dd540c4ea085934770`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Create/implement the next C1 capsule for Task Board + Task Capsule extractors. | T-0344 provides the shared contract; the next source-specific step should produce Task nodes/state sources from `docs/TASK_BOARD.md` and `tasks/T-*/TASK.md`/handoff basics. | `docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md`; `docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md`. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| No public context graph CLI exists yet. | Users cannot request a full `hadara.contextGraph.v1` report until extractor and graph builder capsules land. | Continue through C1 extractor, graph builder, state projection, task context, and CLI/read surface capsules. |
| Existing Phase 8 state projection remains separate. | Later C1 work must reconcile projection semantics carefully. | Keep state projection alignment in its dedicated C1 capsule. |
