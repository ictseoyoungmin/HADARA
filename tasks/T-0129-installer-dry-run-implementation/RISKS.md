# Risks

| Risk | Mitigation |
|---|---|
| Dry-run planning accidentally mutates install locations. | Implement a report-only service and CLI handler; actions are descriptive `wouldWrite` entries only. |
| Public JSON leaks private absolute source or target paths. | Redact absolute/user paths and only emit safe display paths or relative paths with `pathRedacted: true`. |
| `--mode execute` is mistaken for install execution. | Return a schema-valid disabled report with `INSTALL_EXECUTION_DISABLED` and set a non-zero CLI exit code. |
| WSL and Windows behavior is conflated. | Keep `platform` explicit and report WSL Windows-shim rejection separately. |
| Command discovery misclassifies installer planning as write/execute behavior. | Register `hadara install plan --json` as a read-only, low-risk capability and keep MCP surfaces unchanged. |
| Host npm/Node validation gives misleading results. | Use Docker temp-copy validation and record exact results in evidence. |
