# Handoff

## Last Completed

- Added `src/cli/task-json.ts` with `hadara.task.list.v1` and `hadara.task.show.v1` read models.
- Updated `hadara task list --json` and `hadara task show <task-id> --json`.
- Preserved human-readable task list/show behavior.
- Added tests for task list, task show, and missing task envelopes.
- Verified Docker `npm ci && npm run check`: 9 test files passed, 39 tests passed.
- Verified task list/show JSON success, missing task exit code 6, and text list smoke paths.

## Next Recommended Step

Continue CLI JSON normalization for policy/hermes/evidence commands, or move to Evidence Store artifact handling.
