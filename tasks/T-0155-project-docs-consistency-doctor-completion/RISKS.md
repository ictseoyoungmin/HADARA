# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Expanded docs checks could over-report historical drift. | Warning noise may reduce trust in doctor output. | Medium | Keep most cross-doc drift warning-level and focused on stable table/section semantics. | Mitigated |
| Literal `T-0154a` capsule IDs are unsupported. | Task parsers expect numeric IDs and could miss the capsule. | High | Use numeric T-0155 capsule with logical T-0154a wording in docs/slices. | Mitigated |
| Built CLI smokes could use stale `/workspace/dist`. | Tests may pass against the wrong CLI. | Medium | Follow SOP: build in Docker, refresh `/workspace/dist`, then smoke. | Mitigated |
