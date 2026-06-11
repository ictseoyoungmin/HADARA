# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `docs/specs/0.3.0/rc1/00_Protocol_Migration_for_0_3_Adoption.md` | Added | Defines rc.1 adoption migration scope and non-release boundary. | Done |
| `src/services/protocol-migration.ts` | Added | Implements project/task scoped dry-run-first 0.3 migration plans and execute writes. | Done |
| `src/cli/protocol.ts` | Updated | Adds `protocol migrate` dispatcher and CLI output. | Done |
| `src/services/capability-registry.ts` | Updated | Registers `protocol.migrate` command metadata. | Done |
| `src/schemas/protocol-migration.schema.json` | Added | Documents `hadara.protocol.migration.v1`. | Done |
| `src/core/schema.ts` and `src/schemas/schema-index.json` | Updated | Registers schema fixture for validation. | Done |
| `tests/unit/protocol-migration.test.ts` | Added | Covers project/task migration, before-hash guards, and schema validity. | Done |
| `tests/unit/protocol-cli.test.ts`, `tests/unit/command-registry.test.ts`, `tests/unit/schema-fixtures.test.ts` | Updated | Covers CLI, registry, and schema index integration. | Done |
| `README.md` | Updated | Distinguishes current source candidate rc.1 from current published npm rc.0 install. | Done |
| `package.json`, `src/services/release-artifact.ts`, `tests/unit/release-artifact.test.ts` | Updated | Points npm metadata and staged release artifacts at the public `HADARA` repo. | Done |
| `docs/CLI_JSON_CONTRACT.md`, `docs/SCHEMAS.md`, `docs/IMPLEMENTATION_SOP.md`, `docs/specs/0.3.0/00_HADARA_0_3_0_Phase_7_Surface_Refactor_Program.md` | Updated | Reflects migration command, schema, required reading, and post-7.6 adoption scope. | Done |
| `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/TASK_BOARD.md` | Update planned | Track T-0299 completion state before close. | Pending |
