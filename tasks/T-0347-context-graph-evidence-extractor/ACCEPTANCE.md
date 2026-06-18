# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `extractEvidence()` emits Evidence nodes from Task Capsule `evidence.jsonl` records using normalized persisted or compatibility ids. | Done | `src/context/evidence-extractors.ts`; `tests/unit/context-graph-evidence-extractors.test.ts`; `ev:T-0347:dde6dc9eee154d8daa4afff7`. |
| AC-2 | Evidence nodes expose id source/stability, persisted schema version, source line, category, outcome, visibility, artifacts, tags, and legacy metadata. | Done | Focused unit coverage for v2 durable and legacy line-fallback evidence; `ev:T-0347:dde6dc9eee154d8daa4afff7`. |
| AC-3 | Extractor emits `HAS_EVIDENCE`, `CLOSES_WITH`, and `DEPENDS_ON_EVIDENCE` edges from task ownership, close-proof tags, and exact evidence marker tags. | Done | Focused edge assertions in `tests/unit/context-graph-evidence-extractors.test.ts`. |
| AC-4 | Missing or malformed evidence logs degrade with explicit context graph issues without appending, migrating, or repairing evidence. | Done | Missing and malformed evidence regressions; scope is read-only. |
| AC-5 | Focused/full validation passed and evidence is attached. | Done | Docker focused tests passed 5 files / 17 tests; Docker `npm run check` passed 124 files / 808 tests; `ev:T-0347:dde6dc9eee154d8daa4afff7`. |
