# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Workbench becomes a competing validator. | Reports could drift from existing close/doctor/lint sources. | Medium | Aggregate source summaries and avoid reimplementing validator logic. | Mitigated |
| Expensive validation runs twice. | `task status` could become slow and confusing. | Medium | Use `task close` dry-run as the single done-level validation source; unit test call count. | Mitigated |
| Read-only command writes accidentally. | Operator console would violate Phase 3 safety posture. | Low | No-write snapshot test over project docs and task evidence files. | Mitigated |
| Text output may need further polish. | Non-JSON UX could remain basic after JSON surface lands. | Medium | Track worker-friendly text output as a follow-up Phase 3 slice. | Accepted |
