# Risks

| Risk | Mitigation |
|---|---|
| Rejecting all binary artifacts can block screenshot evidence. | Document this as a temporary safe default; future work can add sanitized/private binary handling. |
| Secret patterns may have false positives. | Reject only common high-risk patterns and keep private evidence available. |
| Secret patterns may have false negatives. | Treat this as baseline protection; future tasks can add broader scanners. |
