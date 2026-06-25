# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Existing consumers may ignore new fields. | UX improvement is not felt by older consumers. | Medium | Keep old `primaryNextAction` and `commands`; document `primaryAction` as additive preferred field. | Mitigated |
| Agents may still run live context discovery too early. | Mounted filesystem latency or broad reads can slow sessions. | Medium | `avoidForNow` explicitly warns not to opt into `--live` unless bounded/warm packet is insufficient. | Mitigated |
| Choosing `task lifecycle` could feel redundant with `task status`. | Slightly more command-surface overlap. | Low | Lifecycle is cheaper and purpose-built for the first phase decision; status remains secondary in `commands`. | Accepted |
