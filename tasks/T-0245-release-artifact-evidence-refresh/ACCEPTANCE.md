# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Release artifact evidence is refreshed from a clean worktree for the current commit. | Pending | Built `release artifact --execute --attach-evidence` output. |
| AC-2 | Post-refresh release dry-run no longer reports stale release artifact evidence. | Pending | Built `release dry-run --json` output. |
| AC-3 | Release mutation remains absent: no npm publish, no GitHub Release creation, no Docker build, no token loading. | Pending | Release artifact and dry-run report privacy/execution flags. |
| AC-4 | Capsule evidence, docs, ready, close, and audit-close are complete. | Pending | Evidence records and lifecycle command output. |
