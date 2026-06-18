# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and C1 evidence extractor scope. | Done | Read shared state docs and `docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md`. |
| 2 | Add `extractEvidence()` and any needed deterministic helper. | Done | `src/context/evidence-extractors.ts`; `src/context/extractor-contract.ts`. |
| 3 | Add focused unit coverage. | Done | `tests/unit/context-graph-evidence-extractors.test.ts`. |
| 4 | Run validation and refresh dist if source changes pass. | Done | Docker focused tests, Docker `npm run build`, Docker `npm run check`, dist refresh, built CLI version smoke, and `git diff --check` passed in `ev:T-0347:dde6dc9eee154d8daa4afff7`. |
| 5 | Attach evidence, update handoff/state docs, and close. | Done | Evidence attached and close-source docs updated before lifecycle close. |
