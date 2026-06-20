# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Users may assume `task finalize --execute` performs writes. | Confusing CLI expectation. | Medium | The command returns `TASK_FINALIZE_PLAN_HASH_REQUIRED` without a plan hash and still refuses reviewed execute in this capsule with explicit unsupported diagnostics. | Mitigated |
| Plan status could drift from canonical lifecycle commands. | Wrong next action guidance. | Low | The report composes current finish/ready/close/audit read models and keeps source report ids on every step. | Mitigated |
| `ok:false` for incomplete dry-runs could be mistaken for command failure. | Automation may need to inspect `mode`/steps rather than only `ok`. | Medium | Docs describe `ok` as all finalize steps satisfied; incomplete plans remain structured and read-only. | Accepted |
