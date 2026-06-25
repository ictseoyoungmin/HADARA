# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Raising test timeout could hide real hangs. | Medium | Low | Keep timeout bounded at 30s and env-overridable; full suite still completed in 19.61s. | Mitigated |
| Core bootstrap default may surprise consumers expecting full debt summary by default. | Medium | Low | `tier=full` remains explicit and debt routes remain available; route-level T-0419 already made core default. | Mitigated |
| Publish clone may still be stale. | High | Medium | T-0418 must be retried from a clone refreshed to include T-0420. | Open |
