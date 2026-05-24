# Risks

| Risk | Mitigation |
|---|---|
| Moving report builders could drift CLI JSON shape. | Keep the existing facade and run policy JSON/preflight unit tests. |
| MCP policy evaluate could diverge from CLI/domain policy behavior. | Compare MCP payloads directly against `createPolicyEvaluateReport` in service parity tests. |
| Scope could expand into policy matrix refactor. | Keep permission/risk behavior unchanged and defer matrix work to its dedicated slice. |
