# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| README overclaims publish status for `0.3.0-rc.0`. | Users may try to install an unpublished version. | Medium | README separates current source candidate from current published npm release and keeps install examples on `0.2.0-rc.3`. | Mitigated |
| Release dry-run cannot run while worktree is dirty. | Release evidence would be blocked. | High | Committed source/docs/evidence checkpoint, then ran `release artifact --execute`, release dry-run, and publish dry-run. | Mitigated |
| Host npm network/cache failures obscure validation results. | Package/clean-checkout smokes can fail for environment reasons. | Medium | Use `/tmp` npm cache for package smoke and Docker dev container for clean-checkout smoke; record failed probes honestly. | Mitigated |
