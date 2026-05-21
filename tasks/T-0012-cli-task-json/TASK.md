# T-0012 CLI Task JSON

## Goal

Continue CLI JSON normalization by adding stable machine-readable output for `hadara task list --json` and `hadara task show <task-id> --json`.

## Scope

- Add versioned JSON envelopes for task list and task show.
- Preserve existing human-readable task list and task show output.
- Use project-relative portable capsule paths in JSON.
- Return exit code `6` for missing task show state.
- Add focused tests and Docker CLI smokes.

## Out of Scope

- JSON normalization for every CLI command.
- Task create JSON output.
- Task status parsing from TASK.md beyond existing list metadata.
- Evidence artifact storage.
- Agent loop, dashboard, MCP body, or real provider adapters.

## Status

Done
