# Risks

| Risk | Mitigation |
|---|---|
| Boundary design is mistaken for permission to implement package execution. | State explicitly that this capsule adds no `npm pack`, publish, archive, checksum, deployment, GitHub, shell-execution surface, or MCP release/package behavior. |
| Future package-smoke output leaks machine-local paths, raw logs, secrets, or package artifacts into committed docs. | Require public reduced JSON/text evidence, redaction checks, private raw artifact storage, and relative project/task paths only. |
| Release gate becomes an execution surface. | Keep release gate checks text/read-model based and test readiness markers only. |
| Host npm/Node validation gives misleading results. | Use Docker temp-copy validation and record exact commands in task evidence. |
