# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| src/context/session-start.ts | Add | Build `hadara.sessionStart.v1` with bounded default no-live behavior and explicit `--live`. | Done |
| src/cli/session.ts | Add | Public `hadara session start --json` handler. | Done |
| src/cli/main.ts | Update | Dispatch the `session` command group. | Done |
| src/services/capability-registry.ts | Update | Register the new read-only command. | Done |
| src/schemas/session-start.schema.json | Add | Schema fixture for the new report. | Done |
| src/schemas/schema-index.json | Update | Register the new schema fixture. | Done |
| src/core/schema.ts | Update | Runtime schema loader registration. | Done |
| tests/unit/session-start.test.ts | Add | Service-level bounded composition tests. | Done |
| tests/unit/context-graph-cli.test.ts | Update | CLI smoke for `session start`. | Done |
| tests/unit/schema-fixtures.test.ts | Update | Schema fixture coverage. | Done |
| tests/unit/command-registry.test.ts | Update | Command registry coverage. | Done |
| docs and T-0378 capsule files | Update | Protocol state, acceptance, tests, command docs, schema docs, and handoff. | Done |
