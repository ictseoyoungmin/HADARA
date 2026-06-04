# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Artifact refresh command fails because the capsule scaffold itself makes the worktree dirty. | Release artifact evidence cannot be honestly refreshed. | High before scaffold commit | Commit scaffold/scope first, then run artifact refresh from a clean worktree. | Active |
| Release dry-run remains blocked by another evidence freshness check. | Capsule may not fully unblock release readiness. | Low | Treat command output as authoritative; if another blocker appears, document it rather than broadening scope silently. | Open |
| Release artifact command could be mistaken for publish/deploy. | Operator might expect external registry mutation. | Low | Keep docs and evidence focused on local artifact generation; command does not publish, create GitHub Releases, build Docker images, or load tokens. | Mitigated |
