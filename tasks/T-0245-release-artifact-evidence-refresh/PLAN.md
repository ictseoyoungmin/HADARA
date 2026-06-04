# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and release readiness context. | Done | `task next --json`, `docs/AGENT_HANDOFF.md`, `docs/RELEASE_READINESS.md`. |
| 2 | Commit this scaffold/scope so the release artifact command can start from a clean worktree. | Done | Scaffold commit `736b3b5`. |
| 3 | Harden release artifact `npm pack` to use a disposable npm cache. | In Progress | First refresh attempt failed at npm cache write; source fix and test update in progress. |
| 4 | Run release artifact evidence refresh with `--execute --attach-evidence`. | Pending | Built CLI command output. |
| 5 | Verify release dry-run readiness after refresh. | Pending | Built CLI release dry-run output. |
| 6 | Record validation evidence, update tracked docs, and close/audit. | Pending | `EVIDENCE.md`, `evidence.jsonl`, task lifecycle commands. |
