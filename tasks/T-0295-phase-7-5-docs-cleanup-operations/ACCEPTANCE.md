# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | AC-7.5-1: `docs mark` dry-run validates allowed transitions and reports impact. | Met | `tests/unit/docs-mark.test.ts`; focused test evidence |
| AC-2 | AC-7.5-2/3: `docs mark --execute` requires matching registry before-hash and updates only `.hadara/docs-registry.json`. | Met | `tests/unit/docs-mark.test.ts`; built CLI smoke evidence |
| AC-3 | AC-7.5-4: superseded/historical/archived docs are excluded from effective default required reading. | Met | `tests/unit/docs-required-reading.test.ts` |
| AC-4 | AC-7.5-5: `docs archive` is dry-run by default and does not move files. | Met | `tests/unit/docs-archive.test.ts`; built CLI smoke evidence |
| AC-5 | AC-7.5-6: docs doctor detects stale docs in Required Reading and missing supersededBy targets. | Met | `tests/unit/docs-doctor.test.ts` |
| AC-6 | AC-7.5-7: tests cover invalid transitions, stale hash, canonical review guard, and missing replacement target. | Met | `tests/unit/docs-mark.test.ts`; focused test evidence |
