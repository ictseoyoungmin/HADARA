# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Command registry metadata supports explicit `implementationFiles` and `testFiles` hints. | Done | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| AC-2 | Code index reports mark implementation/test files with command families derived from matched command hints. | Done | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| AC-3 | Explicit implementation hints emit `IMPLEMENTS_COMMAND` edges with source metadata and explicit confidence. | Done | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| AC-4 | Explicit test-file hints emit registry-scoped `TESTS_FILE` edges without adding import/name/text test heuristics. | Done | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| AC-5 | Missing explicit implementation hints may use a bounded CLI handler fallback only as heuristic confidence. | Done | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| AC-6 | Focused/full Docker validation evidence is attached and shared docs point to test relation edges next. | Done | `ev:T-0356:3f6509b1f0da4c569b03befa` |
