# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| README could imply `0.3.0` is already published. | Users may try a package version before T-0316 publish. | Medium. | Use "stable source target" and "after publish" wording until T-0316. | Mitigated in draft edits |
| Release artifact dirty-worktree guard can block evidence refresh. | T-0315 release evidence cannot be generated from uncommitted source state. | High. | Used clean source-candidate checkpoints before artifact generation; final artifact evidence points at the final T-0315 source commit. | Mitigated |
| Stable readiness could accidentally perform publish mutation. | Registry state changes outside approval-gated T-0316. | Low. | Used release publish dry-run only; final report has `publishExecuted:false`, `githubReleaseCreated:false`, and `dockerImageBuilt:false`. | Mitigated |
