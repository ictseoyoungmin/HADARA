# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep release readiness hardening additive and read-only. | Accepted | The next release/package slice should improve operator judgment without crossing publish/deploy boundaries. | `release dry-run` still reports `publishExecuted:false`, `githubReleaseCreated:false`, and `dockerImageBuilt:false`. |
| D-2 | Put next actions in `release dry-run`, not only prose docs. | Accepted | The report already knows which readiness check failed, so operators should not infer the next command from long check summaries. | Built CLI smoke returned `refresh-release-artifact-evidence` for stale release artifact commit metadata. |
| D-3 | Record stage timing diagnostics inside the report. | Accepted | On `/mnt/f`, release dry-run can be slow; the report should identify whether strict gate, evidence scan, or artifact validation is responsible. | Built CLI smoke reported `strict-release-gate` as the slow stage. |
