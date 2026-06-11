# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Phase 7.1 AC-7.1-1: every public command has exactly one command registry entry. | Done | `tests/unit/command-registry.test.ts` |
| AC-2 | Phase 7.1 AC-7.1-2 and AC-7.1-8: default `hadara help` is short, registry-backed, lifecycle-oriented, and hides non-canonical/advanced/release/dev/UI/integration/alias surfaces. | Done | `tests/unit/help.test.ts`; built CLI smoke evidence |
| AC-3 | Phase 7.1 AC-7.1-3: `hadara help lifecycle` shows the primary lifecycle and diagnostic side paths. | Done | `tests/unit/help.test.ts`; built CLI smoke evidence |
| AC-4 | Phase 7.1 AC-7.1-4: `hadara help command <id>` explains family, scope, lifecycle stage, requiredness, write boundary, examples, docs, related commands, and conflicts. | Done | `tests/unit/help.test.ts`; `node dist/cli/main.js help command task.close` smoke |
| AC-5 | Phase 7.1 AC-7.1-5: `hadara commands --json` returns `hadara.commands.registry.v1` and supports family and requiredness filters. | Done | `tests/unit/command-registry.test.ts`; built CLI commands smokes |
| AC-6 | Phase 7.1 AC-7.1-6 and AC-7.1-11: `tools list` remains compatible and is generated from the same authoritative registry, with drift tests guarding against a second inventory. | Done | `tests/unit/tools-list-command-registry.test.ts`; `tests/unit/tools-list.test.ts`; `tests/unit/mcp-tools.test.ts` |
| AC-7 | Phase 7.1 AC-7.1-7: registry records canonical/alias/default-help/deprecated-candidate metadata where applicable. | Done | `tests/unit/command-registry.test.ts` |
| AC-8 | Phase 7.1 AC-7.1-9: new schema fixtures are registered and documented. | Done | `tests/unit/schema-fixtures.test.ts`; `docs/SCHEMAS.md` |
| AC-9 | Phase 7.1 AC-7.1-10: tests fail on missing registry metadata for public command dispatch. | Done | `tests/unit/command-registry.test.ts` required public command list |
| AC-10 | HADARA close-source requirements: evidence is attached and handoff/state docs are updated before ready/close. | Done | Evidence records, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md` |
