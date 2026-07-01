# Task Status Cockpit

## Purpose

`hadara task status` is the default read-only cockpit for the Task Capsule loop.

It replaces the ordinary agent need to call separate next-work and lifecycle-phase commands.

## Command Shape

| Command | Mode | Writes | Use |
|---|---|---:|---|
| `hadara task status --json` | next-work selection | No | Start of session, after a task closes, or when no task is selected. |
| `hadara task status --task T-XXXX --json` | selected-capsule cockpit | No | After capsule creation and at meaningful loop boundaries. |

## Default Loop

| Loop Point | Agent Action | Status Use |
|---|---|---|
| 1 | Start or resume work. | Run `task status --json` to select next work. |
| 2 | Create a capsule if needed. | Run `task create`, then `task status --task T-XXXX --json`. |
| 3 | Author capsule contract. | Use status authoring guidance until `TASK.md` is concrete. |
| 4 | Implement scoped work. | Continue when the next action is known; status is not required after every file edit. |
| 5 | Validate and record evidence. | Run validation/evidence commands, then status at the evidence boundary. |
| 6 | Update capsule and shared docs. | Rerun status if close-source or handoff state changed. |
| 7 | Review finalize dry-run. | Run `task finalize --task T-XXXX --json` only when status says finalize is ready. |
| 8 | Execute reviewed finalize. | Run `task finalize --execute --plan-hash <hash>` after inspecting the dry-run. |
| 9 | Stop or select next work. | If status/finalize reports `closed-valid`, do not run separate `audit-close` unless debugging. |

## Operating Rule

Agents do not need to call `task status` before every known next step.

Use it at loop boundaries:

- no task selected
- after creating a capsule
- after authoring the task contract
- after validation/evidence changes
- after shared close-source docs change
- before finalize dry-run
- after finalize or when blocked/confused

## Compatibility Commands

| Command | Replacement | Status |
|---|---|---|
| `hadara task next --json` | `hadara task status --json` | Planned removal compatibility command. |
| `hadara task lifecycle --task T-XXXX --json` | `hadara task status --task T-XXXX --json` | Planned removal compatibility command. |

The compatibility commands remain available for debugging older flows until their removal window is explicitly scheduled.
