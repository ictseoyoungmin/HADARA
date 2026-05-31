# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Recommendation source order surprises operators. | Agents might pick a later or wrong task. | Medium | Prefer Development Slices first, then Task Board fallback, and include `source`/`reason`. | Mitigated |
| Missing capsule recommendation creates files implicitly. | Could bypass explicit Task Capsule protocol. | Low | Command is read-only and emits `createCommand` only. | Mitigated |
| Recommendations become stale if docs drift. | Output may reflect stale tracked docs. | Medium | Include Task Board status/path, capsule presence, required reading, and issues for missing sources. | Mitigated |
