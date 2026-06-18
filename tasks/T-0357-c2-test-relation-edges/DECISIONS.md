# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D1 | Model test imports, filename matches, and command mentions as `TESTS_FILE` edges. | Accepted | These are the C2 spec-listed test relation signals and fit the existing edge vocabulary. | `ev:T-0357:6406481495244038961bd0de` |
| D2 | Model evidence-referenced test paths as `VALIDATED_BY_EVIDENCE` edges from test file to evidence id. | Accepted | Evidence nodes are not part of the code index file/symbol set, but the edge vocabulary already includes evidence validation. | `ev:T-0357:6406481495244038961bd0de` |
| D3 | Keep graph merge and public CLI out of this capsule. | Accepted | Worker plan lists context graph integration after test relation edges. | `ev:T-0357:6406481495244038961bd0de` |
