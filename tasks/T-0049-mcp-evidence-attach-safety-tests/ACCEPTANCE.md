# Acceptance Criteria

- [x] Successful evidence attach returns one MCP JSON text payload.
- [x] Successful evidence attach payload uses `hadara.evidence.collect.v1`.
- [x] Safe public text artifact attachment succeeds and records a managed artifact path.
- [x] Artifact paths outside the workspace are rejected.
- [x] Public artifacts containing secret-like content are rejected.
- [x] Invalid MCP evidence attach input returns `TOOL_INPUT_INVALID`.
- [x] Default MCP startup remains read-only.
- [x] Required Docker validation passes.
- [x] Done-level capsule validation passes.
- [x] Evidence and handoff documents are updated.
