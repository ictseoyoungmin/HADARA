# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Phase 5.6 close could be confused with Phase 5.7 implementation. | Runtime projection code might be assumed complete before T-0216 starts. | Medium | T-0215 scope records status/handoff sync only; T-0216 through T-0223 remain Draft implementation capsules. | Mitigated |
| `/mnt/f` cold dashboard reads remain slow after Phase 5.6 close. | Operators may still see delayed live bootstrap until projection work lands. | High | Handoff and projection spec point to Phase 5.7 projection architecture as the fix. | Accepted |
