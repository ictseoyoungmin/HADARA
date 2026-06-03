# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Route release/smoke evidence attachment through the canonical writer. | Accepted | T-0233 made the canonical writer the durable-id source; custom JSONL writers would preserve v1 drift. | `smoke-evidence.ts`, `release-artifact-evidence.ts`. |
| D-2 | Preserve release artifact directory names. | Accepted | Operators and strict release artifact checks already expect `artifacts/package-smoke`, `artifacts/clean-checkout-smoke`, and `artifacts/release-artifact`. | Focused attach tests. |
| D-3 | Use normalized release proof semantics for v2, not the v1-only legacy predicate. | Accepted | v2 records should be strict release proof when they are public, passed, release-category, linked to schema-valid/source-ok artifacts, and legacy kind is release-compatible. | `release-dry-run` v2 fixture. |
| D-4 | Do not migrate historical evidence yet. | Accepted | Migration still needs per-task dry-run and before-hash guards. | Out-of-scope and handoff notes. |
