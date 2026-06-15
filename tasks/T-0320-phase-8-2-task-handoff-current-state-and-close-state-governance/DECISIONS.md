# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | New task handoffs should generate `TaskStatus` and `CloseState` rows instead of a single ambiguous `Status` row. | Accepted | Separates persistent lifecycle state from derived close proof state at creation time. | Phase 8.2 spec. |
| D-2 | Done-level validation should preserve exact legacy `Status` tokens but reject stale mixed phrases such as `Done pending lifecycle close`. | Accepted | Avoids breaking historical fixtures while stopping the drift that triggered Phase 8.2. | T-0319 policy and Phase 8.2 spec. |
| D-3 | PLAN drift detection should inspect the table Status column only. | Accepted | High-confidence signal with low prose false positives. | Phase 8.2 spec. |
