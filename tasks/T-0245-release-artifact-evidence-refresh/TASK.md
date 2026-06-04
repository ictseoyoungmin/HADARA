# T-0245 Release Artifact Evidence Refresh

## Metadata

| Field | Value |
|---|---|
| ID | T-0245 |
| Title | Release Artifact Evidence Refresh |
| Status | In Progress |
| Created | 2026-06-04 |
| Updated | 2026-06-04 |

## Goal

| Goal | Notes |
|---|---|
| Refresh release artifact evidence for the current clean git commit. | T-0243 added the dirty-worktree guard; T-0244 was committed so release artifact freshness can now be regenerated honestly. |

## Scope

| In Scope | Reason |
|---|---|
| Run `release artifact --execute --json --output dist-release --attach-evidence --task T-0245` from a clean worktree. | The release dry-run blocker is stale release artifact evidence for an old git commit. |
| Verify release dry-run after refresh. | Proves package-smoke, clean-checkout, and release-artifact evidence all align with the current commit. |
| Keep release mutation blocked. | Artifact refresh must not publish to npm, create GitHub Releases, build Docker images, or load tokens. |
| Record evidence and close/audit the capsule. | HADARA workflow requires evidence-backed completion. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish, GitHub Release creation, Docker build/publish, or PyPI publish. | This capsule refreshes local release artifact evidence only. |
| Package-smoke or clean-checkout smoke regeneration. | Current release dry-run reports those evidence records as passed. |
| Release dry-run performance optimization. | Slow strict release gate timing is known and not required for evidence freshness. |

## Status

In Progress

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-04 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-04 | In Progress | Scope fixed to clean-worktree release artifact evidence refresh. | Capsule update |
