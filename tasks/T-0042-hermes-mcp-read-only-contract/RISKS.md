# Risks

| Risk | Mitigation |
|---|---|
| MCP contract overpromises write behavior before gates are ready. | Keep T-0042 strictly read-only and explicitly out of scope write/execution behavior. |
| External agents see multiple JSON schemas and mishandle failures. | Document normal command failure vs early CLI fallback envelopes. |
| Agents expect full history in compact handoff. | Update AGENTS/SOP to follow Historical Index for older history. |
