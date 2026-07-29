# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0740 |
| Title | Harden validation argv contract and proof authority |
| Status | Done |
| Created | 2026-07-29T22:21 |
| Updated | 2026-07-29T22:32 |

## Last Completed

| Item | Evidence |
|---|---|
| Focused trust-boundary tests passed for close proof authority, validation argv classifier/budget, schema fixtures, CLI help, command registry, and schema runtime. | ev:T-0740:5c0e76227a9c488ba3710a8f |
| TypeScript no-emit passed. | ev:T-0740:eb7f68e3b34d41c0949464c8 |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| No T-0740 follow-up required. | terminal | no | Reviewer P1 trust-boundary gaps were handled in this capsule; continue only if new rc2 review findings appear. | docs/TASK_BOARD.md, docs/CLI_JSON_CONTRACT.md, docs/TASK_WORKFLOW_COMMANDS.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `validation run --json` now returns `hadara.validation.run.v2` by default. | Consumers expecting raw `argv` in the default report must migrate. | Use `argvHash` and bounded `argvPreview`, or call `--compat v1` only for legacy consumers. |
| v2 schema rejects unknown top-level fields. | Contract drift and raw legacy `argv` injection are now schema-invalid. | Add new fields deliberately through a new schema update. |
