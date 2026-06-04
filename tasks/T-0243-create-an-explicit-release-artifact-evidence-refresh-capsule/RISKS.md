# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Dirty worktree artifact evidence appears fresh. | Release dry-run could pass because artifact `gitCommit` equals HEAD while artifact contents include uncommitted changes. | High in active development. | Add a clean-worktree guard before staging or `npm pack`. | Mitigated |
| Guard blocks legitimate local release artifact refresh during active work. | Operators need to clean/commit first. | High | Handoff records explicit next step; failed guard evidence documents no artifact was generated. | Accepted |
| Node `spawnSync` reports `error` alongside successful git status on mounted filesystems. | Guard could misclassify success as status failure. | Medium | Treat `status:0` with stdout as success even if `error` is populated. | Mitigated |
