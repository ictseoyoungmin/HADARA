# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | New evidence writes append `hadara.evidence.v2` JSONL records with persisted durable ids. | Done | T-0233 `evidence.jsonl` contains v2 command evidence ids such as `ev:T-0233:762e03a265bd4b78ba28708b`. |
| AC-2 | v2 records include id, fingerprint, idSource/idStability, category/outcome, visibility, summary, artifacts, tags, and legacy v1 metadata. | Done | Writer and schema tests cover v2 shape; `src/evidence/evidence.ts` emits persisted metadata and legacy compatibility fields. |
| AC-3 | Existing v1 records and mixed v1/v2 `evidence.jsonl` files remain readable by evidence list, lint, normalizer, semantic gates, and harness validation. | Done | Focused evidence/harness/task/dashboard/TUI suites passed after mixed-record hardening. |
| AC-4 | Private evidence still does not leak private source paths into committed public records. | Done | Evidence list and writer tests cover private v2 sanitization and artifact suppression. |
| AC-5 | This capsule can record its own v2 evidence and still pass `task ready`, `task close`, and `task audit-close`. | Done | Built CLI task lifecycle checks passed for T-0233 after v2 evidence was recorded. |
| AC-6 | Focused and full Docker validation pass. | Done | Docker focused suites passed 10 files / 81 tests and 9 files / 78 tests; `npm run dev:docker-sync-build` passed 91 files / 599 tests. |
| AC-7 | Project state, task board, handoff, and task capsule evidence are updated. | Done | T-0233 capsule docs and project state docs were refreshed before close. |
