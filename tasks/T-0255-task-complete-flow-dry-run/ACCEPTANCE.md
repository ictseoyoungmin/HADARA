# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara task complete --task <id> --json` returns `hadara.task.complete_flow.v1` and is read-only. | Met | Unit tests and built CLI smoke. |
| AC-2 | The report composes shared finish, ready, close, and audit read models. | Met | Unit tests assert source reports/stages and service imports shared lifecycle builders. |
| AC-3 | Incomplete tasks expose exactly one primary next action. | Met | Unit tests assert one next action for finish-required and close-required stages. |
| AC-4 | Actor context and coordinator-oriented shared-doc state are included. | Met | Unit tests assert default actor and `stateDocs.recommendedActorRole: coordinator`. |
| AC-5 | `--execute` is unsupported and performs no writes. | Met | Unit test snapshots files and asserts `TASK_COMPLETE_EXECUTE_UNSUPPORTED`. |
| AC-6 | Schema, workflow docs, and CLI contract are updated. | Met | Schema fixtures, runtime schema test adjacency, `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/CLI_JSON_CONTRACT.md`, and `docs/SCHEMAS.md`. |
| AC-7 | Docker validation and built CLI smoke pass. | Met | Docker sync-build passed 94 files / 638 tests; built CLI smoke returned complete-flow JSON for T-0255. |
