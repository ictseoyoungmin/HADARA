# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use normalized evidence ids directly as Evidence node ids. | Accepted | The context graph spec defines persisted v2 `ev:` ids and normalized legacy compatibility ids as Evidence IDs. | `src/context/evidence-extractors.ts`; `ev:T-0347:dde6dc9eee154d8daa4afff7` |
| D-2 | Emit `CLOSES_WITH` only from explicit `close-proof` evidence tags in this extractor. | Accepted | This keeps the source extractor deterministic and avoids duplicating close audit/state-projection derivation rules. | `tests/unit/context-graph-evidence-extractors.test.ts` |
| D-3 | Treat `resolves:` and `supersedes:` evidence markers as `DEPENDS_ON_EVIDENCE` graph edges. | Accepted | Both marker forms express a direct evidence-to-evidence relationship; more specific proof semantics can be added in graph/query layers later. | `src/context/evidence-extractors.ts` |
