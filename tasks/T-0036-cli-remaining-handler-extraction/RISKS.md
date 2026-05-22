# Risks

| Risk | Mitigation |
|---|---|
| Run command behavior could drift because it is larger than other command groups. | Move existing code intact, keep helper exports, and run unit tests plus built CLI run smoke. |
| Task create smoke mutates task docs. | Run mutation smokes only in Docker-copied workspaces. |
| MCP command is currently a placeholder. | Preserve text output exactly and avoid implementing MCP server behavior. |
