# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| High-level lifecycle commands could hide proof boundaries. | Agents might trust aggregate output without understanding writes. | Medium | Spec requires per-step write boundaries and keeps canonical commands. | Mitigated in design |
| Follow-up capsules could overreach into shared-doc writes. | Close-source drift or hidden state mutation. | Medium | Spec explicitly forbids shared-doc writes from finalize. | Mitigated in design |
| Too many new command names could confuse users. | More surface area to learn. | Low | Budget starts with read-only `task lifecycle` and repair plan; finalize execute is last and conditional. | Tracked |
