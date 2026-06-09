# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Docker baseline unavailable during this session. | Full repository confidence is lower than the normal Docker sync-build. | Medium | `/tmp` build and focused tests passed; rerun Docker before rc3 readiness if available. | Open |
| Proof verdict depends on current semantic analyzer categories. | Future category changes could alter verdicts. | Medium | Focused tests cover core verdicts; use additive schema changes for future proof model updates. | Accepted |
