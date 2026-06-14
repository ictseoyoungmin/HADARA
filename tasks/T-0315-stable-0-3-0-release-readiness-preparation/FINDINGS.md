# Findings

| Finding | Severity | Status | Notes |
|---|---|---|---|
| Stable `0.3.0` readiness needs a version bump from `0.3.0-rc.2`. | High | In Progress | `package.json` and `package-lock.json` are being updated before validation. |
| Readiness and publish should be separate capsules. | High | Accepted | T-0315 is no-mutation readiness; T-0316 will be approval-gated publish. |
| Release artifact builder requires a clean worktree. | Medium | Open | Evidence refresh ordering must account for this guard. |
