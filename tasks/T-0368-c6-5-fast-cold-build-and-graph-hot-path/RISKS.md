# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Git command unavailable or repository has no usable status. | Fast path unavailable. | Low | Fall back to the existing full manifest build and mark fast path as skipped/miss in report metadata. | Mitigated |
| Dirty worktree detection is too broad and causes misses. | Less speed benefit but no stale reuse. | Medium | Fingerprint hashes only context-relevant status entries and stats dirty/untracked context source subsets; fallback remains conservative. | Mitigated |
| Fast path metadata leaks into public contracts unexpectedly. | Consumers may depend on unstable fields. | Low | Fields are additive optional metadata on cache summaries/manifests and graph cache metadata. | Mitigated |
| Mounted filesystem still makes git status slow. | First read may remain slower than desired. | Medium | This task removes duplicate full manifest construction on fresh cached reads; graph budgets and code-index shards remain follow-up scope. | Accepted |
