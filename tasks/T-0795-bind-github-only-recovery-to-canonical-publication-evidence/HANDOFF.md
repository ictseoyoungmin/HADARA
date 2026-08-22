# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0795 |
| Title | Bind GitHub-only recovery to canonical publication evidence |
| Status | Done |
| Created | 2026-08-22T21:13 |
| Updated | 2026-08-22T21:15 |

## Last Completed

| Item | Evidence |
|---|---|
| Commit `bc76b7db` adds canonical npm evidence resolution, byte-bound report checks, retained asset validation, and release-tag target verification for `--github-only`. | `ev:T-0795:3b25716af4104ee7b3dcbdcc` |
| The capsule is a retroactive lifecycle record; no npm/GitHub mutation or fresh RC6 generation was performed while reconstructing it. | `ev:T-0795:1fb9c2cc375446b9b5a487e7`; scope recorded in `TASK.md`. |

## Pre-Close Operator Action

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| No prerequisite remains before close. | terminal | no | Capsule contract, validation evidence, handoff, and close-source prose are complete. | `docs/TASK_WORKFLOW_COMMANDS.md`; T-0795 `TASK.md` |

## Post-Close Continuation

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Prepare a fresh RC6 artifact from current source in a separate capsule; do not reuse retained bytes. | actionable | yes | T-0795 recovery hardening must be recorded before release preparation proceeds. | `docs/RELEASE_READINESS.md`; T-0794 evidence; T-0795 evidence |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
