# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Timeline is mistaken for a live stream. | Operator may expect automatic updates. | Medium | Schema and UI remain read-only/generated; polling/SSE remain deferred. | Mitigated |
| Timeline exposes private/local paths. | Public dashboard could leak local state. | Low | Use sanitized read models and test absence of `.hadara/local`. | Mitigated |
| Event ordering becomes flaky. | Snapshot/tests become unstable. | Low | Assign deterministic sequential order in service. | Mitigated |
