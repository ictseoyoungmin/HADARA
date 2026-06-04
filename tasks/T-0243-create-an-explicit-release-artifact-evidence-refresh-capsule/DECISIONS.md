# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Require a clean git worktree before release artifact execution. | Accepted | The report records git commit metadata, so artifact contents must correspond to that commit. | Built CLI blocked dirty worktree before npm pack. |
| D-2 | Do not auto-clean or commit to satisfy release artifact freshness. | Accepted | Release evidence refresh should not mutate version-control state beyond explicit artifact/evidence writes. | T-0243 records clean-worktree refresh as next step. |
| D-3 | Treat successful git status as authoritative even if Node also reports a spawn warning. | Accepted | `/mnt/f` can return `status:0` and stdout while `spawnSync.error` is set; failing that case causes false `GIT_STATUS_FAILED`. | Built CLI now reports `RELEASE_ARTIFACT_WORKTREE_DIRTY` instead of git status failure. |
