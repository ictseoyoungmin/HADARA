# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Context becomes a competing source of truth. | Agents may read stale compact guidance instead of authoritative docs. | Medium | Context explicitly routes to source docs and forbids full history/design content. | Mitigated |
| Migration overwrites existing project-specific context. | Existing projects lose curated notes. | Medium | Migration uses missing-only action and tests existing context preservation. | Mitigated |
| Docs registry consumers reject the new kind. | `docs list`, `docs doctor`, or required-reading surfaces could fail. | Low | Schemas allow string kinds; focused docs registry/required-reading tests pass. | Mitigated |
| Full repository validation is not run in this narrow capsule. | Regressions outside touched surfaces may be missed. | Low | Focused tests cover touched surfaces; build and built smoke passed; full check deferred to broader release/readiness capsules. | Accepted |
