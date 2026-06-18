# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Full graph output can be large. | CLI JSON may be noisy for humans. | Medium | Keep command diagnostic and JSON-oriented; future context pack/slice commands can add compact views. | Mitigated |
| Default extraction can produce warnings from existing repository drift. | Users might treat warning-level degradation as command failure. | Medium | Preserve builder `ok` semantics: graph/state errors fail, warnings are represented in summaries/issues. | Mitigated |
| Cache fields could be mistaken for implemented cache support. | Consumers could rely on nonexistent cache hits. | Low | Keep cache metadata as `used:false, hit:false` and document persistent cache as out of scope. | Mitigated |
