# Risks

| Risk | Mitigation |
|---|---|
| Debt warnings could be mistaken for hard validation failures. | Keep T-0069 report warnings read-only and non-blocking. |
| LOC/complexity tracking could sprawl. | Limit this slice to capsule size indicators and leave changed-LOC analysis for a later utility. |
