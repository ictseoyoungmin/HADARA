# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Release artifact evidence is refreshed from a clean worktree for the current commit. | Passed | Built `release artifact --execute --attach-evidence` returned `ok:true` for commit `2eff19c8ab63b635804352d2c71803226d592749`. |
| AC-2 | Post-refresh release dry-run no longer reports stale release artifact evidence. | Passed | Built `release dry-run --json` returned `ok:true`, readiness `ready`, blockers 0, and accepted the latest T-0245 release artifact evidence. |
| AC-3 | Release mutation remains absent: no npm publish, no GitHub Release creation, no Docker build, no token loading. | Passed | Artifact, dry-run, and publish dry-run reports kept mutation/privacy flags false. |
| AC-4 | Capsule evidence and tracked docs are complete. | Passed | Evidence records attached; capsule and project docs updated. |
