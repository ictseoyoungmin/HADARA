# Risks

| Risk | Mitigation |
|---|---|
| Dashboard APIs accidentally grow into write or execution surfaces. | Routes call existing read-model services only; no shell, provider, MCP write, task mutation, or evidence-write code was added. |
| Static dashboard route hardening regresses while adding APIs. | Existing static route tests remain in place and new API boundary tests cover HEAD, POST, unknown API, and traversal-like paths. |
| Evidence route leaks private evidence details by default. | The route calls `createEvidenceListReport()` without `includePrivate`, preserving the existing public-default evidence read behavior. |
