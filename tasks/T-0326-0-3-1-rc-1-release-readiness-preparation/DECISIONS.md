# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Prepare `hadara@0.3.1-rc.1` as the first Phase 8 status-governance release candidate. | Accepted | Phase 8 implementation and CloseState cleanup are complete through T-0325; user requested the rc1 readiness capsule. | T-0318 through T-0325; user request. |
| D-2 | Keep T-0326 mutation-free and split publish/recycle into T-0327 and T-0328. | Accepted | Release readiness evidence should be separable from approval-gated registry mutation and from consumer installed-package verification. | User request; release readiness policy. |
| D-3 | Keep README release status concise and link version text to release notes. | Accepted | The package page should not over-emphasize historical RCs; users still need transparent routing to detailed release history. | README update plan. |
| D-4 | Use a clean source checkpoint before release artifact execution. | Accepted | The release artifact command intentionally blocks dirty worktrees. | `RELEASE_ARTIFACT_WORKTREE_DIRTY` policy; T-0315 precedent. |
| D-5 | Treat `0.3.1-rc.1` as a valid patch-line npm release candidate. | Accepted | The requested version is not covered by the older `0.x.0-rc.N` release policy, so strict gate and publish dry-run must accept `0.x.y-rc.N` while preserving private/package metadata checks. | `src/services/release-publish.ts`, `src/services/operational-debt.ts`, release tests. |
| D-6 | Pre-create Draft T-0327/T-0328 capsules. | Accepted | The manual publish helper checks that the task capsule matches the current package version; pre-creating T-0327 lets the operator run the publish helper directly after T-0326 closes. | T-0327/T-0328 capsule scaffolds. |
