# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read HADARA session docs and Phase 7.1 spec. | Done | `AGENTS.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/specs/0.3.0/02_Phase_7_1_Command_Surface_Registry_and_Structured_Help.md` |
| 2 | Extend `src/services/capability-registry.ts` into the authoritative command registry. | Done | `src/services/capability-registry.ts` |
| 3 | Add registry-backed help and commands CLI projections. | Done | `src/cli/help.ts`, `src/cli/commands.ts`, `src/cli/main.ts` |
| 4 | Keep `tools list` as a compatibility projection from the same registry. | Done | `src/services/tools-list.ts`, `tests/unit/tools-list-command-registry.test.ts` |
| 5 | Add schemas, command-surface docs, and focused tests. | Done | `src/schemas/commands-registry.schema.json`, `src/schemas/command-help.schema.json`, `docs/COMMAND_SURFACE.md`, focused tests |
| 6 | Run focused validation, build, CLI smokes, and available broader checks. | Done | `EVIDENCE.md`; full suite has timeout-only residual blockers recorded in `RISKS.md` |
| 7 | Self-review the diff and prepare the capsule for finish/ready/close/audit. | Done | Self-review completed; close/commit lifecycle pending after close-source docs are finalized |
