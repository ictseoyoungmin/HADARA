# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/capability-registry.ts` | Modify | Authoritative Phase 7.1 command/capability inventory. | Done |
| `src/services/tools-list.ts` | Modify | Compatibility projection from the command registry. | Not Changed |
| `src/cli/main.ts` | Modify | Route `help` and `commands`, and replace flat default help. | Done |
| `src/cli/help.ts` | Add | Registry-backed text help renderers. | Done |
| `src/cli/commands.ts` | Add | Registry-backed `commands --json` handler. | Done |
| `src/schemas/commands-registry.schema.json` | Add | JSON contract schema for `hadara.commands.registry.v1`. | Done |
| `src/schemas/command-help.schema.json` | Add | JSON/help metadata schema fixture for command help projection. | Done |
| `src/schemas/schema-index.json` | Modify | Register new schemas. | Done |
| `docs/COMMAND_SURFACE.md` | Add | Human-facing registry taxonomy and command-surface rules. | Done |
| `docs/SCHEMAS.md` | Modify | Document new schema contracts. | Done |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Modify | Reference registry-backed help without duplicating inventory. | Done |
| `tests/unit/command-registry.test.ts` | Add | Registry coverage, uniqueness, canonical metadata, schema registration. | Done |
| `tests/unit/help.test.ts` | Add | Help rendering and default-help reduction checks. | Done |
| `tests/unit/tools-list-command-registry.test.ts` | Add | Tools-list projection drift checks. | Done |
| `tests/unit/tools-list.test.ts` | Modify | Align compatibility expectations with registry-derived command patterns. | Done |
| `tests/unit/mcp-tools.test.ts` | Modify | Align MCP tools-list expectations with registry-derived command patterns. | Done |
| `tests/unit/init.test.ts` | Modify | Align README release-state expectation with rc3 published state from T-0290. | Done |
| `tests/unit/schema-fixtures.test.ts` | Modify | Register expected Phase 7.1 schema ids. | Done |
| `tasks/T-0291-implement-phase-7-1-command-surface-registry-and-structured-help/*` | Modify | Capsule plan, acceptance, evidence, and handoff. | In Progress |
| `docs/PROJECT_STATE.md` | Modify | Track latest completed task when capsule closes. | Pending |
| `docs/AGENT_HANDOFF.md` | Modify | Carry forward Phase 7.2 next step after close. | Pending |
| `docs/DEVELOPMENT_SLICES.md` | Modify | Mark Phase 7.1 done when validated. | Pending |
