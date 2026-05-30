# T-0150 Init Follow-up Commands Completion

## Goal

Complete the remaining init follow-up surfaces from the Phase 1 init refactoring plan in one bounded capsule.

## Scope

- Add a read-only init scaffold doctor/migration report.
- Make `hadara init` avoid eager local/private runtime-store creation.
- Add safe profile upgrade planning/execution that only creates missing scaffold docs.
- Add a project-specific Required Reading registration command.
- Add explicit optional integration enable commands for Hermes/MCP-style docs without making them init defaults.
- Update tests, docs, evidence, and handoff.

## Out of Scope

- Automatic migration or overwrite of user-edited scaffold files.
- Broad Hermes/MCP implementation changes.
- Shell/provider/release execution behavior.
- MCP write tools for init follow-up actions.

## Status

Done
