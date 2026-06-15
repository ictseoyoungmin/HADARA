# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Policy docs claim stricter runtime behavior than exists. | Future workers may assume validators reject all non-canonical tokens today. | Medium | Explicitly label this as policy/template guidance and preserve compatibility-token notes. | Mitigated |
| Generated init docs drift from root workflow docs. | New projects may continue ambiguous status language. | Medium | Updated `src/cli/init.ts` and focused init tests with the same policy wording. | Mitigated |
| CloseState and TaskStatus remain conflated in handoff fixtures. | The next capsule may inherit ambiguous generated handoff state. | Medium | Left handoff scaffold mutation to Phase 8.2 and recorded next-step boundary clearly. | Accepted |
| Full Docker wrapper timed out on existing docs tests. | T-0319 cannot claim a clean full-suite baseline even though the scoped policy/template checks passed. | Medium | Recorded failed full Docker evidence and passed focused Docker init/template validation plus docs/harness checks; carry hardening to later review if recurring. | Accepted |
