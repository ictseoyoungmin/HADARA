# Risks

| Risk | Mitigation |
|---|---|
| Capability discovery accidentally implies disabled tools are callable. | Keep disabled surfaces in a separate `disabled` array and do not register them in MCP schemas. |
| Opt-in evidence attach appears default-enabled. | Report `enabledByDefault: false` unless the MCP registry was created with evidence attach enabled. |
| CLI and MCP discovery drift. | Use a shared `createToolsListReport` service. |
