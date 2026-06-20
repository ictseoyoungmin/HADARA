# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Over-filter a real handoff task title that happens to mention `task next`. | Could skip a valid handoff recommendation. | Low | The filter requires both a `task next` phrase and command-like verbs such as run/select/choose/create. | Mitigated |
| Current real workspace still has no planned next release capsule. | `task next` may fall back to the newly created T-0391 Draft row during this task. | Medium | That is correct while T-0391 is active; after close, handoff/state docs will be updated. | Accepted |
| Full Docker validation may be slower than the narrow parser change. | Time cost. | Medium | Run focused validation first, then full sync-build before close. | Mitigated |
