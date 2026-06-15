# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| README claims stable published before the operator publish output is attached. | Source checkout briefly reads as post-publish before registry mutation evidence is recorded. | Medium | This is intentional package-page staging for npm; release readiness and T-0316 docs state that registry verification remains pending until operator output is attached. | Accepted pre-publish boundary |
| Helper is run from a dirty worktree. | Release artifact refresh or publish helper can fail, or package can contain unintended changes. | Medium | Commit this preparation first, then run the helper from the clean prepared clone. | Mitigated before operator run |
| npm auth output or token details are pasted into committed docs. | Credential leak. | Low | Only commit reduced helper summary and npm view verification; never include auth URLs, tokens, or private logs. | Active |
| Publish succeeds but T-0316 evidence is not recorded. | Repository state and registry state drift. | Medium | Operator will paste helper output; Codex will attach evidence, update state docs, close, and commit. | Pending operator output |
