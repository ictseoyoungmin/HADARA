# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D1 | Add optional `implementationFiles` and `testFiles` fields directly to command registry entries. | Accepted | The active C2 spec names command registry metadata as the preferred source for command implementation links. | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| D2 | Emit explicit `IMPLEMENTS_COMMAND` and registry-scoped `TESTS_FILE` edges from file nodes to `command:<id>`. | Accepted | Code index edges need source-addressed routing hints before graph integration. | `ev:T-0356:3f6509b1f0da4c569b03befa` |
| D3 | Keep test import/name/text heuristics out of this capsule. | Accepted | Worker plan lists test relation edges as the next separate C2 capsule. | `ev:T-0356:3f6509b1f0da4c569b03befa` |
