# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | AC-7.4-1: managed section parser handles valid markers, missing markers, duplicate ids, nesting, and invalid metadata. | Met | `tests/unit/managed-sections.test.ts` |
| AC-2 | AC-7.4-2/3: patch dry-run returns `hadara.docs.patchPlan.v1` and proves changes stay inside managed markers. | Met | `tests/unit/docs-patch.test.ts`, built CLI smoke |
| AC-3 | AC-7.4-4/5: patch execute requires matching target before-hash and fails closed on mismatch. | Met | `tests/unit/docs-patch.test.ts`, built CLI smoke |
| AC-4 | AC-7.4-6: existing task finish behavior remains compatible on legacy docs. | Met | `tests/unit/task-finish.test.ts` |
| AC-5 | AC-7.4-7: fresh init docs include markers only for safe generated sections. | Met | `tests/unit/init.test.ts`, `tests/unit/managed-sections.test.ts` |
| AC-6 | AC-7.4-8: no broad prose docs are automatically rewritten. | Met | `tests/unit/managed-sections.test.ts`, `tests/unit/docs-patch.test.ts` |
