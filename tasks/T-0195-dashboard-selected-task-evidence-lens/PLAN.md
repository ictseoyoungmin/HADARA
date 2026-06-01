# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs, workbench contract, and Phase 5 dashboard spec. | Done | Required docs were read during Phase 5/T-0195 setup. |
| 2 | Add read-only dashboard task-workbench and evidence-lint routes. | Done | `src/cli/dashboard.ts` updated. |
| 3 | Bind selected task evidence lens to workbench/evidence read models. | Done | `docs/design/dashboard/index.html` updated. |
| 4 | Add focused selected-task/proof-status regression tests. | Done | `tests/unit/dashboard-static.test.ts` updated. |
| 5 | Run validation, attach evidence, finish/close the capsule, update docs, and commit. | Done | Focused/full validation passed; evidence attached; `task ready`, `task close --execute`, and `task audit-close` returned `ok:true`. |
