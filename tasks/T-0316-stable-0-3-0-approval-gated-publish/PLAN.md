# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0315 handoff/readiness state. | Done | CONTEXT.md |
| 2 | Create T-0316 publish capsule and make package-facing docs ready for npmjs rendering. | Done | README / release docs updates |
| 3 | Commit the pre-publish preparation so the helper can run from a clean worktree. | In Progress | git commit pending |
| 4 | Operator runs `npm login` and `scripts/release/manual-publish-rc.sh T-0316 --execute`. | Pending | Operator output |
| 5 | Attach publish and npm view verification evidence to T-0316. | Pending | Operator output / EVIDENCE.md / evidence.jsonl |
| 6 | Finish, ready, close, audit-close, and commit T-0316. | Pending | Lifecycle command reports |
