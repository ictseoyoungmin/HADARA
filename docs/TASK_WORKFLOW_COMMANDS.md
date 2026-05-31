# TASK_WORKFLOW_COMMANDS

HADARA task workflow commands are split by responsibility. Similar-looking commands are not interchangeable: some only report state, some check readiness, some perform bounded bookkeeping writes, and some append close evidence.

## Standard Task Loop

Use this loop for ordinary implementation capsules:

```bash
hadara task next --json
hadara task status --task T-XXXX --json

# work...

hadara evidence add-command --task T-XXXX --summary "..." --result passed --json
hadara task ready --task T-XXXX --level done --json

hadara task finish --task T-XXXX --json
hadara task finish --task T-XXXX --execute --json

hadara task close --task T-XXXX --json
hadara task close --task T-XXXX --execute --json

hadara task audit-close --task T-XXXX --json
```

`task finish` and `task close` are intentionally separate. `finish` synchronizes bounded status bookkeeping. `close` records close evidence after validation succeeds. `audit-close` checks the resulting close evidence after the write.

## Command Semantics Matrix

| Command | Role | Default Mode | Writes? | `ok` Meaning | Failure Exit |
|---|---|---|---|---|---|
| `hadara task next --json` | Recommend the next task from roadmap and board state. | Read-only report. | No. | Recommendation report was generated. | Task-style failures use 6. |
| `hadara task status --task T-XXXX --json` | Operator console projection for one task. | Read-only report. | No. | Report was generated for an existing task, not that the task is ready. | Task-style failures use 6. |
| `hadara evidence add-command --task T-XXXX --summary "..." --result passed --json` | Record command-log evidence supplied by the operator. | Write command. | Yes, appends capsule evidence. | Evidence append succeeded. | Evidence/task-style failures use 6. |
| `hadara task ready --task T-XXXX --level done --json` | Readiness preflight before finish/close. | Read-only report. | No. | Requested readiness level passed. | Task-style failures use 6. |
| `hadara task finish --task T-XXXX --json` | Preview bounded status bookkeeping for `TASK.md` and `docs/TASK_BOARD.md`. | Dry-run report. | No. | Finish plan has no blocking issues. | Task-style failures use 6. |
| `hadara task finish --task T-XXXX --execute --json` | Apply bounded status bookkeeping for `TASK.md` and `docs/TASK_BOARD.md`. | Execute after dry-run review. | Yes, bounded to those files. | Planned bookkeeping writes succeeded or no write was needed. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --json` | Preview close validation and close-evidence append. | Dry-run report. | No. | Close preconditions passed. | Task-style failures use 6. |
| `hadara task close --task T-XXXX --execute --json` | Append canonical close evidence after close preconditions pass. | Execute after dry-run review. | Yes, close evidence only. | Close evidence append succeeded. | Task-style failures use 6. |
| `hadara task audit-close --task T-XXXX --json` | Verify close evidence after close. | Read-only report. | No. | Valid close evidence exists and no audit blockers remain. | Task-style failures use 6. |

## Non-Overlap Rules

- `task next` chooses work; it does not create a capsule or infer completion.
- `task status` is an operator console; `ok: true` means report generation succeeded. Readiness lives in `state.ready`, `summary.blockers`, and `issues`.
- `task ready` checks whether the capsule can satisfy a requested validation level; it does not write evidence or status.
- `evidence add-command` records an operator-supplied command result; it does not execute shell commands or capture stdout/stderr.
- `task finish` may update only the Task Capsule `TASK.md` status and matching `docs/TASK_BOARD.md` status/path row.
- `task close` may append only close evidence. It must not update status docs, Task Board rows, handoff, Project State, Development Slices, or arbitrary evidence.
- `task audit-close` is read-only and should be run after `task close --execute`.

## State Documents

`task finish --execute` deliberately does not update broad prose state. Operators still update `docs/DEVELOPMENT_SLICES.md`, `docs/PROJECT_STATE.md`, and `docs/AGENT_HANDOFF.md` when the task changes roadmap, project, or handoff state. Future automation for those files should remain dry-run-first and bounded.
