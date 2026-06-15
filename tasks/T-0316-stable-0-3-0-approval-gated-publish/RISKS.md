# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| README claims stable published before the operator publish output is attached. | Source checkout briefly reads as post-publish before registry mutation evidence is recorded. | Medium | This was intentional package-page staging for npm; T-0316 now has publish and npm view evidence. | Mitigated |
| Helper is run from a dirty worktree. | Release artifact refresh or publish helper can fail, or package can contain unintended changes. | Medium | Pre-publish preparation was committed before operator execution. | Mitigated |
| npm auth output or token details are pasted into committed docs. | Credential leak. | Low | Only reduced helper summary and npm view verification are committed; auth URL/token details are excluded. | Mitigated |
| Publish succeeds but T-0316 evidence is not recorded. | Repository state and registry state drift. | Medium | `command:T-0316:npm-publish` records publish and registry verification. | Mitigated |
