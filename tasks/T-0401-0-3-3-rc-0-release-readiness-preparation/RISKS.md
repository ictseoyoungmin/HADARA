# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Release artifact blocks on dirty worktree. | Artifact evidence cannot be generated after uncommitted source-candidate edits. | High | Follow T-0336 pattern: checkpoint source-candidate commit before artifact generation. | Open |
| Publish accidentally runs during readiness. | Registry mutation could happen before approval. | Low | Run only `release publish --mode dry-run`; keep npm publish/GitHub Release out of scope. | Mitigated by scope |
| Host npm cache/sandbox failures affect package smokes. | Release smoke commands may fail for environment reasons. | Medium | Prefer Docker/built CLI paths; if sandbox cache fails, record failure and rerun with approved/scoped environment only if required. | Open |
| Version/docs drift between package metadata and README/release docs. | Release gate or package users see inconsistent candidate identity. | Medium | Update package files, README, RELEASE_NOTES, and RELEASE_READINESS together, then validate with Docker/full release gates. | Open |
