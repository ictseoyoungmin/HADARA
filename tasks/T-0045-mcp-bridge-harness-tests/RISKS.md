# Risks

| Risk | Mitigation |
|---|---|
| Contract tests duplicate unit tests without checking CLI parity. | Compare MCP payloads to existing report builders where available. |
| Tests accidentally depend on machine-local paths. | Use temp project roots and portable path assertions. |
| Tests introduce MCP writes or execution. | Only call read tools and policy preflight, which does not execute commands. |
