# Risks

| Risk | Mitigation |
|---|---|
| MCP server version reads the target project package instead of HADARA's package. | Resolve package metadata relative to the server module, not `projectRoot`. |
| Missing package metadata breaks MCP initialize. | Fall back to an inert `unknown` version string rather than throwing. |
| Version fix accidentally changes MCP capabilities. | Keep the response shape unchanged and run focused MCP server tests. |
