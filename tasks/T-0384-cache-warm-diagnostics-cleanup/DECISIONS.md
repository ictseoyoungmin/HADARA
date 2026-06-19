# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add `diagnostics` as an additive field instead of changing existing summary semantics. | Accepted | Existing consumers can keep using `summary`/`manifest`; richer operators can read diagnostics. | `src/context/context-cache-store.ts` |
| D-2 | Treat fresh manifest plus missing/stale shards as `partial`. | Accepted | Source-manifest freshness alone does not guarantee warm graph/code paths are ready. | `tests/unit/context-cache-store.test.ts` |
| D-3 | Include `recommendedCommandArgs` alongside the human command string. | Accepted | Structured args avoid shell quoting ambiguity and support future agent consumers. | `diagnostics.recommendedCommandArgs` |
