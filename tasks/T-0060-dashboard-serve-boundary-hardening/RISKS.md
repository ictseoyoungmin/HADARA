# Risks

| Risk | Mitigation |
|---|---|
| Boundary tests may imply production server security. | Keep scope explicit: this is a static reference server, not a production multi-user service. |
| Future live dashboard slices may widen routes. | Preserve allowlist tests so widening requires intentional updates. |
