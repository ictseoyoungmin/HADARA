---
id: workflow
group: Core model
label: Lifecycle Workflow
short: Orient, execute, validate, finalize.
icon: workflow
eyebrow: Finalize-first lifecycle
title: Completion is a derived state.
lead: A task moves from intent to verified closure through explicit artifacts. Close evaluates acceptance and evidence; it does not merely stamp a status field.
callout: Status describes the current state. Close decides whether closure is valid — and it will not move a task to done on its own say-so.
order: 10
---

## 01 · Frame
### Create or select the capsule
Start from `task status`; create a new capsule only when the read model cannot find a suitable open task.

## 02 · Verify
### Record real evidence
Run validation through HADARA when possible, or record a direct result when the tool environment prevents wrapper execution.

## 03 · Derive
### Close the task
`task close` derives lifecycle completion from the authored contract, evidence, readiness checks, and close audit.

## Commands
```shell
hadara task status --json
hadara task status --task T-0042 --json
hadara validation run --task T-0042 --check "unit tests" --json -- npm test
hadara task close --task T-0042 --json
```

## The primary loop

| Step | Command or action | Purpose |
|---:|---|---|
| 1 | `hadara task status --json` | Select next work or route to an active task. |
| 2 | `hadara task create "..." --json` | Open a capsule only when needed. |
| 3 | `hadara task status --task T-XXXX --json` | Read selected-capsule phase and next action. |
| 4 | Edit `TASK.md` | Author goal, scope, plan, acceptance, validation, changes, risks. |
| 5 | Implement the scoped change | Modify project files within the task boundary. |
| 6 | `hadara validation run ...` or `hadara evidence add-command ...` | Append durable evidence. |
| 7 | Update task docs and close-time handoff | Keep close-source prose current before closure. |
| 8 | `hadara task close --task T-XXXX --json` | Run guarded close transaction. |

The implementation step has no special HADARA command. It is the project work itself. HADARA controls the envelope around that work.

## Status-first, not document-first

A new session should not begin by rereading every doc. Use read models:

```shell
hadara task status --json
hadara task status --task T-XXXX --json
hadara context pack --task T-XXXX --json
```

Open only the files those reports route. This keeps agents from making decisions based on stale prose or historical specs.

## Close is proof-last

`task close --json` internally runs the close machinery in order:

```text
finish → ready → close → audit
```

It records readiness evidence when required, appends close proof last, and reports success only when the final audit reaches `closed-valid`.

The public `hadara.task.close.v2` report exposes:

| Field | Meaning |
|---|---|
| `closeState` | `blocked`, `ready-to-close`, `closed-valid`, `closed-stale`, or `in-progress` |
| `planStatus` | Whether the current close plan is blocked, executable, satisfied, or pending |
| `transaction.planHash` | Reviewed-plan identity for dry-run/execute flows |
| `transaction.lockOrder` | Lifecycle locks used by close |
| `writeSummary` | Planned/applied writes and whether close proof was appended |
| `primaryNextAction` | Agent-facing recovery or next command |
| `source.finalize` | Diagnostic compatibility metadata, not the primary public contract |

## When to use dry-run

Ordinary work:

```shell
hadara task close --task T-XXXX --json
```

Reviewed close across a human or automation boundary:

```shell
hadara task close --task T-XXXX --dry-run --json
hadara task close --task T-XXXX --execute --plan-hash sha256:<hash> --json
```

Do not carry old plan hashes from memory. Re-run the dry-run when close-source files changed.

## Two supported work styles

![Two supported work styles](two-supported-work-styles.png)
*Two operating patterns for the same underlying Task Capsule loop — not two different protocols.*

| Style | Use when | Guardrail |
|---|---|---|
| Tight loop | You want frequent review after each small change. | Close one capsule at a time. |
| Delegated loop | You let an agent perform a broader scoped task. | The agent must still use status, evidence, and task close surfaces. |

## Handoff and continuation

`HANDOFF.md` is not a place for same-capsule chores such as “run validation” or “update acceptance.” Those belong in the current task before close.

Use close-time handoff for the next meaningful project step after this capsule closes. HADARA can promote a real next step into structured current-state continuation. If no further work is queued, say that explicitly and avoid phrasing it as a new task to create.
