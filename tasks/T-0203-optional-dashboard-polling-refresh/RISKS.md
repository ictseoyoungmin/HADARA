# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Polling could create request spam during degraded states. | Poor local responsiveness. | Medium | Backoff multiplies delay and hidden documents pause polling. | Mitigated |
| Polling could be mistaken for streaming/live execution. | Governance confusion. | Low | It is off by default, operator-toggleable, read-only, and documented as non-streaming. | Mitigated |
