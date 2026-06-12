# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Add optional `heading`, `fixHint`, `example`, and structured `remediationHint` fields to issue objects. | Accepted | Gives humans concise guidance while keeping machine-readable context. | Planned implementation. |
| D-2 | Generate hints at the harness validation source and propagate them through ready/close. | Accepted | Avoids duplicate hint logic and keeps shared checks consistent. | Planned implementation. |
| D-3 | Do not change `proof explain` in T-0306. | Accepted | The spec explicitly excludes proof parity from acceptance. | Scope boundary. |
