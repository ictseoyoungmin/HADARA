# Status Report Schema

## Report Modes

`task status` has two read-only report modes.

| Mode | Schema | Trigger |
|---|---|---|
| Selection | `hadara.task.status.v1` | `hadara task status --json` without `--task`. |
| Workbench | `hadara.task.workbench.v1` | `hadara task status --task T-XXXX --json`. |

## Selection Report

Required top-level fields:

| Field | Meaning |
|---|---|
| `schemaVersion` | `hadara.task.status.v1`. |
| `command` | `task.status`. |
| `mode` | `select-work`. |
| `summary.recommendations` | Number of next-work recommendations. |
| `loop.phase` | Always `select-work`. |
| `loop.primaryNextAction` | Create or inspect the recommended capsule. |
| `recommendations` | Compatibility projection from the existing next-work read model. |
| `sources.taskNext` | Embedded compatibility source report. |

## Workbench Report Additions

`hadara.task.workbench.v1` keeps existing task/status/evidence/readiness fields and adds:

| Field | Meaning |
|---|---|
| `loop.phase` | Current capsule loop phase. |
| `loop.summary` | Human-readable phase explanation. |
| `loop.statusCommand` | Canonical status command for the current mode. |
| `loop.primaryNextAction` | The next action most likely needed at this boundary. |
| `loop.deprecatedCommands` | Compatibility commands and replacements. |

## Loop Phases

| Phase | Meaning |
|---|---|
| `select-work` | No task is selected; choose or create a capsule. |
| `author-task` | Required task prose or acceptance/validation contract is still placeholder. |
| `implement` | Known scoped implementation or doc work remains. |
| `validate-evidence` | Validation/evidence is required before close can proceed. |
| `finalize-dry-run` | Run and inspect `task finalize --json`. |
| `finalize-execute` | Execute the reviewed finalize plan with the current plan hash. |
| `closed-valid` | The task has current valid close proof. |
| `blocked` | Status found blocking issues that need remediation or manual review. |

## Non-Goals

- `task status` must not create tasks, append evidence, update docs, or finalize tasks.
- `task status` must not hide failed or blocked evidence.
- `task status` must not make `finalize --execute` implicit.
