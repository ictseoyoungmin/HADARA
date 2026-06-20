# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Extra file reads could slow context pack. | Slightly higher bounded read cost. | Low | Only selected raw-sliceable item paths are read; missing/non-sliceable items fall back. | Mitigated |
| Missing files could make context pack fail. | Regression in degraded output. | Low | File read errors are caught and graph source hash is retained. | Mitigated |
| Source hash semantics could surprise consumers. | Contract ambiguity. | Medium | CLI/spec/schema docs now state item file hash preference and fallback behavior. | Mitigated |
