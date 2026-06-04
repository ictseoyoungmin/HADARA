# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and release readiness context. | Done | `task next --json`, `docs/AGENT_HANDOFF.md`, `docs/RELEASE_READINESS.md`. |
| 2 | Commit this scaffold/scope so the release artifact command can start from a clean worktree. | In Progress | Required by T-0243 dirty-worktree guard. |
| 3 | Run release artifact evidence refresh with `--execute --attach-evidence`. | Pending | Built CLI command output. |
| 4 | Verify release dry-run readiness after refresh. | Pending | Built CLI release dry-run output. |
| 5 | Record validation evidence, update tracked docs, and close/audit. | Pending | `EVIDENCE.md`, `evidence.jsonl`, task lifecycle commands. |
