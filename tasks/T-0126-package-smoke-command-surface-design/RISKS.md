# Risks

| Risk | Mitigation |
|---|---|
| Command-surface design accidentally becomes package-smoke execution. | Keep this capsule limited to docs, read-only release-gate checks, and tests; explicitly avoid `npm pack`, install smoke, artifact creation, publish/deploy, GitHub calls, Docker image builds, and MCP release/package execution. |
| `hadara release smoke` appears as the primary command and implies publish/deploy behavior. | Document `hadara package smoke` as the primary command and reserve release wording for later read-only release readiness. |
| Future package-smoke evidence writes public raw logs or package artifacts. | Require reduced public evidence, explicit `--attach-evidence`, public redaction checks, and private/raw logs only under ignored private/local storage. |
| Local supporting spec is ignored and absent from GitHub clones. | Keep the actionable release/install/package-smoke sequence in tracked docs while treating `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md` as local-only agent context. |
| Host npm/Node validation gives misleading results. | Use Docker temp-copy validation and record exact commands in task evidence. |
