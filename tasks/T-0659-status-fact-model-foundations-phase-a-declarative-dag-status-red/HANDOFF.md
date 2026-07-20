# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0659 |
| Title | Status fact model foundations (Phase A: declarative DAG status redesign) |
| Status | Done |
| Created | 2026-07-20T17:01 |
| Updated | 2026-07-20T17:15 |
## Last Completed

| Item | Evidence |
|---|---|
| Added `src/status/` Fact model: `FactRecord`/`EvaluationState` types, closed predicate/transformer vocabulary, `json-document`/`markdown-section`/`markdown-table`/`git-metadata`/`task-capsule` adapters, and a `project-current-state` fact source that reproduces `.hadara/state/current.json` facts. No CLI wiring or behavior change. | ev:T-0659:9312a99ffa18457086ce8b48, ev:T-0659:3a12f23192c0442e88247043, ev:T-0659:d44381d2c1f143739b983dfe |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Phase B: read-only DAG evaluator (node/edge/predicate/budget/trace) consuming this Fact model, as its own Task Capsule. | Phase A only builds the fact layer; the Declarative DAG design (docx section 7) needs the evaluator before any status-selection behavior can change. | `.hadara/local/tmp_plan/status/redesign_candidate/HADARA_Declarative_DAG_Status_Context_Routing_Design.docx` section 7-8, `src/status/model.ts`, `src/status/predicates.ts` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
