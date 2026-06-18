# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0347 |
| TaskStatus | Done |
| Last Updated | 2026-06-18 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Added read-only Evidence extraction with task ownership, close-proof, dependency, and evidence state outputs. | `ev:T-0347:dde6dc9eee154d8daa4afff7` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Create/start C1 Managed Section, Decision, and Known Problem Extractors. | Task, docs/command, and evidence source extractors now exist; the next source-specific inputs are managed sections, decisions, and known problems before release readiness and graph assembly. | `docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md`; `docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Legacy evidence ids are unstable on reorder. | Legacy Evidence nodes are useful for inspection but not durable cross-task references. | Prefer persisted v2 `ev:` ids for long-lived graph edges and exact marker workflows. |
| `CLOSES_WITH` edges are tag-explicit only. | Historical close records without `close-proof` tags may not produce close edges. | Let graph builder/state projection add derived close-state logic later if needed. |
| No public context graph CLI exists yet. | T-0347 only adds read-only extraction and tests. | Continue planned source extractor sequence before graph builder/read surfaces. |
