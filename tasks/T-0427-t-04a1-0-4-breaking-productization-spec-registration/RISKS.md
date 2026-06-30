# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Registering every 0.4 spec as default reading would bloat agent startup. | Agents would over-read the whole design package on unrelated tasks. | Medium | Mark registry entries as conditional/reference and only add compact SOP rows for README and worker plan. | Mitigated |
| Using actual capsule T-0427 for plan alias T-04A1 could confuse handoff. | Future workers may search for T-04A1 as a literal task id. | Medium | Keep `T-04A1` in the title, capsule docs, shared state, and commit message. | Mitigated |
| Docker rebuild may drift from workspace source if using a stale archive. | Built CLI validation could test old code. | Low | Archive from clean `HEAD` and verify version smoke reports the current commit. | Mitigated |
