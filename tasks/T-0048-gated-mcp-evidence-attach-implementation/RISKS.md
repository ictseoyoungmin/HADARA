# Risks

| Risk | Mitigation |
|---|---|
| Evidence attach becomes available by default. | Keep registry opt-in and preserve guard tests for default behavior. |
| MCP evidence attach bypasses evidence store safety. | Reuse `createEvidenceCollectReport` rather than adding a new write path. |
| Tool output diverges from CLI evidence JSON. | Return the existing `hadara.evidence.collect.v1` report inside one MCP JSON text payload. |
