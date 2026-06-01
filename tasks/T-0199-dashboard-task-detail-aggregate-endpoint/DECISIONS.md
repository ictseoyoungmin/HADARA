# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep legacy Phase 5 selected-task routes available while frontend moves to aggregate detail. | Accepted | Removing read routes would be a compatibility change outside T-0199. | Dashboard HTML no longer uses old URLs; server tests still cover existing routes. |
| D-2 | Derive proof in backend from evidence lint semantic issues and summary. | Accepted | UI should not infer proof strength from raw evidence rows. | `proofFromEvidenceLint()` centralizes selected-task proof status. |
| D-3 | Treat private-only proof as auditability warning, not blocker. | Accepted | Matches Phase 4/5 evidence semantic contract. | `proof.auditabilityWarning` is separate from `proof.blocking`. |
