# Risks

| Risk | Mitigation |
|---|---|
| Public smoke evidence leaks raw logs or paths. | Summary helper only serializes reduced report fields and runs public evidence redaction policy before writing. Tests inject raw-looking stderr/stdout and assert it is absent. |
| Dry-run package smoke starts writing evidence. | Keep evidence attachment wired only to local execution report creation; dry-run remains a planning report. |
| Evidence directory drifts from release-smoke planning. | Use task-local `artifacts/package-smoke/` and `artifacts/clean-checkout-smoke/` paths. |
| Scope expands into private raw log retention. | Leave `--private-logs` manifest retention for a later capsule; T-0136 writes reduced public summaries only. |
