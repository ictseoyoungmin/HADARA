# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Offline flag is mistaken for guaranteed isolation. | Users may overtrust local Python tooling network boundaries. | Medium | Report `enforced:false` and notes explaining best-effort only. | Mitigated |
| Python evidence unblocks npm release readiness. | Release dry-run could falsely pass. | Medium | Provider ecosystem validation and regression test added. | Mitigated |
| Public Python evidence leaks paths/logs. | Privacy/security regression. | Low | Reuse reduced smoke evidence artifact writer and schema checks. | Mitigated |
