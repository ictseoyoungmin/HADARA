# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0175-1 | Add a dedicated task workbench read-model contract. | Accepted | Future dashboard/TUI/MCP/external-agent consumers need one place to learn the workbench boundary. | `docs/TASK_WORKBENCH_READ_MODEL_CONTRACT.md`. |
| D-0175-2 | Keep dashboard/TUI/MCP runtime implementation deferred. | Accepted | Phase 3 prep should not introduce new write or integration surfaces. | Dashboard/MCP docs mark future surfaces deferred/read-only. |
