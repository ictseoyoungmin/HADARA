# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and Evidence v2 plan. | Done | PROJECT_STATE, AGENT_HANDOFF, TASK_BOARD, TASK_WORKFLOW_COMMANDS, EVIDENCE_V2_WRITER_MIGRATION_PLAN. |
| 2 | Inspect current evidence writer/read validation paths. | Done | `src/evidence/evidence.ts`, `src/evidence/normalizer.ts`, `src/services/evidence-list.ts`, `src/services/evidence-lint.ts`, `src/harness/validate.ts`. |
| 3 | Implement v2 persisted writer records with durable ids and compatibility metadata. | Done | `appendEvidenceRecord()` now writes `hadara.evidence.v2` with persisted ids, fingerprints, category/outcome, artifacts, tags, and legacy v1 metadata. |
| 4 | Harden read/lint/harness consumers for v1/v2 mixed evidence. | Done | Evidence list/lint/normalizer/harness/task workbench/task close/dashboard timeline/task detail consumers accept v1 and v2 records. |
| 5 | Add focused regression tests. | Done | Evidence writer/list/lint/normalizer, MCP attach, task capsule, and dogfooding fixture tests updated for v2 default writes and mixed compatibility. |
| 6 | Run focused/full validation and built CLI smoke. | Done | Focused suites passed 10 files / 81 tests and 9 files / 78 tests; Docker sync-build passed 91 files / 599 tests with built CLI smoke `ok:true`. |
| 7 | Attach evidence, finish, close, audit, and update handoff docs. | Done | T-0233 records its own v2 focused/full validation evidence; ready/finish/close/audit loop completed. |
