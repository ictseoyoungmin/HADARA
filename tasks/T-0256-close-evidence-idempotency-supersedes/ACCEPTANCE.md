# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Repeated close with the same source/report hash does not append uncontrolled duplicate evidence. | Met | `tests/unit/task-close.test.ts` duplicate no-op coverage. |
| AC-2 | Changed source/report hash appends new close evidence and supersedes the previous close proof where possible. | Met | `tests/unit/task-close.test.ts` supersedes coverage. |
| AC-3 | `audit-close` reports duplicate/superseded close evidence metadata. | Met | `closeEvidenceAudit` assertions in task-close tests and built audit smoke. |
| AC-4 | Behavior is additive and v1/v2 evidence compatibility remains. | Met | Existing suite plus evidence metadata preservation test; schema ids unchanged. |
| AC-5 | No close readiness gate is bypassed. | Met | Close report still runs done validation, evidence lint, and protocol doctor before append/no-op decisions. |
| AC-6 | Docs and schemas are updated. | Met | CLI JSON contract, workflow docs, schema docs, and close/audit schema fixtures updated. |
| AC-7 | Docker validation and built CLI smokes pass. | Met | Docker sync-build passed 94 files / 641 tests; built close/audit smokes passed. |
