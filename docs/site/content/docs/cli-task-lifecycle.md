---
id: cli-task-lifecycle
group: CLI Reference
label: Task Lifecycle Commands
short: status, create, close — with real flags and the close gate.
icon: git-branch
eyebrow: Command reference
title: Three commands carry the whole loop.
lead: The public task lifecycle is deliberately small — status to orient, create to open a capsule, close to end one. Older fine-grained commands (finish, ready, audit-close) were removed from public routing; close runs that machinery internally now.
callout: task close will not succeed until the Close Entry Gate is satisfied — a missing acceptance criterion blocks close, it doesn't just warn.
order: 21
---

## Orient
### task status
Read project/task state before acting. `task status` is read-only and is the normal way to select work or inspect a selected capsule.

## Open
### task create
Create a new Draft capsule and Task Board row only when no suitable capsule already exists.

## Close
### task close
Run the guarded close transaction. It owns lifecycle status updates, readiness evidence, and close proof.

## Commands
```shell
hadara task status --json
hadara task status --task T-0042 --json
hadara task status --task T-0042 --detail full --json
hadara task create "Fix the retry backoff" --json
hadara task close --task T-0042 --json
hadara task close --task T-0042 --dry-run --json
hadara task close --task T-0042 --execute --plan-hash sha256:<hash> --json
```

## `task status --json`

Use this when no task is selected. It returns `hadara.taskSelection.status.v2`, a read-only next-work selection cockpit.

It can recommend:

| Situation | Typical next action |
|---|---|
| Active task exists | Inspect it with `task status --task`. |
| Structured next work exists | Create or review the recommended capsule. |
| Continuation exists | Review or create a continuation task, depending on disposition. |
| No work found | Report idle/terminal state. |
| Sources are degraded | Stop and inspect issues. |

It does not create tasks or mutate files.

## `task status --task T-XXXX --json`

Use this at loop boundaries for a selected capsule. The default output is compact and fast. It may skip close-grade diagnostics, so it must not claim close readiness unless those checks have actually been evaluated.

Use full detail when blocked:

```shell
hadara task status --task T-0042 --detail full --json
```

Use close dry-run when the question is specifically “what would close do?”:

```shell
hadara task close --task T-0042 --dry-run --json
```

## `task create`

```shell
hadara task create "Fix the retry backoff" --json
```

`task create` creates:

- a `Draft` Task Capsule under `tasks/`
- a matching `docs/TASK_BOARD.md` row
- scaffolded `TASK.md`, `HANDOFF.md`, `EVIDENCE.md`, and `evidence.jsonl`

After creating, immediately inspect the selected task:

```shell
hadara task status --task T-0042 --json
```

Then fill the task contract. Do not close a scaffold-only capsule.

## Close entry gate

Before ordinary close, the capsule needs:

| Gate | Required state |
|---|---|
| Goal | Concrete goal, not placeholder prose |
| Source Documents | Relevant sources listed, or absence explicitly justified |
| Plan | Concrete steps |
| Acceptance | Real criteria with requiredness and disposition |
| Validation | At least one validation method, or documented not-applicable rationale |
| Evidence | Required acceptance has satisfying evidence or accepted residual disposition |
| Handoff | Close-time continuation is current, not same-capsule chores |

## `task close --json`

```shell
hadara task close --task T-0042 --json
```

This is the ordinary close path. It internally reviews the current plan, acquires transaction locks, applies bounded lifecycle writes, records readiness evidence when required, appends close proof last, and succeeds only after the final audit reaches `closed-valid`.

If close is blocked, follow top-level `primaryNextAction` / `nextActions`. Treat `source.finalize` as diagnostic compatibility metadata.

## Reviewed close

Use this only when a separate human or automation boundary must approve the plan:

```shell
hadara task close --task T-0042 --dry-run --json
hadara task close --task T-0042 --execute --plan-hash sha256:<hash> --json
```

Do not reuse an old hash after editing close-source docs.

## Removed public surfaces

These standalone lifecycle commands are no longer public routes:

| Removed surface | Replacement |
|---|---|
| `task finish` | `task close --task T-XXXX --json` |
| `task ready` | `task close --task T-XXXX --dry-run --json` or `task status --detail full` |
| standalone close step | `task close --task T-XXXX --json` |
| `task audit-close` | `task close --dry-run` or `task status --detail full` |
| `task complete` | `task status --task T-XXXX --json` |
| `task lifecycle` | `task status --task T-XXXX --json` |

`task finalize` remains a compatibility/debug route for the internal engine. New agent-facing flows should use `task close`.
