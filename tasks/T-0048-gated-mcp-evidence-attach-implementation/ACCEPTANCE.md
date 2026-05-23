# Acceptance Criteria

- [x] `hadara.evidence.attach` metadata exists for explicit opt-in mode.
- [x] Default `hadara mcp serve` does not advertise `hadara.evidence.attach`.
- [x] Default `hadara mcp serve` rejects `hadara.evidence.attach` as `TOOL_NOT_FOUND`.
- [x] Opt-in mode advertises `hadara.evidence.attach`.
- [x] Opt-in mode writes evidence by reusing the existing evidence collect report path.
- [x] Successful MCP evidence attach returns one JSON text payload with `hadara.evidence.collect.v1`.
- [x] Existing workspace boundary and public artifact redaction checks remain in force.
- [x] No shell execution or provider calls are added.
- [x] Required Docker validation passes.
- [x] Done-level capsule validation passes.
- [x] Evidence and handoff documents are updated.
