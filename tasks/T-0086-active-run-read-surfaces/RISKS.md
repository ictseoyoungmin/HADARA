# Risks

| Risk | Mitigation |
|---|---|
| Accidentally turning active-run reads into mutable run-state behavior. | Scope only `show`, `active.run.read`, and derived resume guidance; leave all writes deferred. |
| MCP resume naming could imply execution. | Document and implement `hadara.active.run.resume` as read-only guidance with no state mutation or command execution. |
| Malformed local active-run state could break external-agent reads. | Reuse `safeCreateActiveRunProjection()` degraded-read behavior. |
