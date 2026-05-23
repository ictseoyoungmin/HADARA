# Risks

| Risk | Mitigation |
|---|---|
| Read tools accidentally mutate Task Capsules or evidence. | Use existing report builders and direct read-only file reads only. |
| Shell policy evaluation is mistaken for execution. | Use `createShellExecutionPreflight`, which reports `willExecute: false`. |
| MCP errors conflict with HADARA issue semantics. | Keep transport errors in JSON-RPC and put HADARA issue codes in `error.data.issue`. |
| Tool registry grows too large for later bridge tests. | Split schemas, registry, and dispatch now before T-0045. |
