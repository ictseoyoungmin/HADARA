---
id: cli-task-lifecycle
group: Agent protocol
label: Task Commands
short: Atomic status, create, and close contracts for agents.
eyebrow: Agent protocol reference
title: Status, create, and close are three bounded task-state operations.
lead: This is an atomic command reference, not a second lifecycle narrative. It defines when each task-state command is called, what it reads or writes, and what success means.
callout: For the connected orient-to-close story, start with Lifecycle Workflow. Ordinary users can state the goal and review the result while the coding agent applies these command contracts.
audience: agent-protocol
commandAudience: agent-protocol
order: 21
---

## Reference boundary

[Lifecycle Workflow](#workflow) owns the end-to-end sequence: orient, contract, implement, validate, preserve evidence, and close. This page deliberately narrows its scope to the three task-state command atoms. Validation and evidence recording have their own contract in [Evidence & Validation](#cli-evidence-validation).

## 01 · Orient
### task status
Read-only selection and selected-task cockpit. `ok:true` means the report was generated, not that a task is ready or closed.

## 02 · Open
### task create
Creates a Draft capsule and matching board state when no suitable capsule exists. The agent then authors the bounded task contract.

## 03 · Close
### task close
Runs the proof-last close transaction and succeeds only when the final audit is `closed-valid`.

## Agent commands

```shell
hadara task status --json
hadara task status --task T-0042 --json
hadara task status --task T-0042 --detail full --json
hadara task create "Fix retry backoff" --json
# Agent implementation work: update source, tests, and task-owned docs inside the capsule.
hadara task close --task T-0042 --json
hadara task close --task T-0042 --dry-run --json
hadara task close --task T-0042 --execute --plan-hash sha256:... --json
```

## `task status --json`

The agent uses it when no task is selected. It can route to active work, recommend creation when structured next work warrants it, report waiting/terminal state, or surface degraded sources. It does not create tasks or append evidence.

| Agent concern | Contract |
|---|---|
| When to call | At session ingress and after the human changes the requested work. |
| Reads/writes | Read-only; it does not create a capsule or claim readiness. |
| `ok:true` | The status report was generated, not that the task is ready or closed. |
| Human-visible result | Why the agent selected, resumed, waited, or stopped. |

## Selected task status

The default report is compact and fast. Complete close-grade diagnostics are available through `--detail full`. When the specific question is “what would close do now?”, the agent can use close dry-run instead of forcing every loop through heavyweight diagnostics.

The selected report also routes the next read. The agent opens the capsule's `TASK.md` and `HANDOFF.md`, then follows registered or explicitly referenced sources instead of loading every historical project document.

## `task create`

The agent creates a capsule only when status and the current human instruction do not identify suitable active work. Creation writes a Draft capsule and Task Board row; it does not mean implementation or validation is complete. The agent then authors the goal, scope, plan, acceptance, validation, constraints, and risks before treating the capsule as a work contract.

## `task close`

Ordinary close is the primary path. The reviewed dry-run + plan-hash form exists when a separate human or automation boundary must explicitly carry the reviewed plan identity.

The transaction reviews the current plan, guards writes, validates both the current pre-close handoff and the post-close continuation that would become active, applies lifecycle-owned mutations, records readiness evidence when required, appends close proof last, and runs final audit. A semantic continuation conflict is rejected before lifecycle writes. Genuine interrupted-write recovery completes through the returned `task close` action; lifecycle-owned fields should not be hand-edited to force closure.

| Agent concern | Contract |
|---|---|
| When to call | After implementation, required evidence, acceptance, risks, and handoff are current. |
| Writes | Bounded task lifecycle projection, readiness evidence, and proof-last close evidence. |
| Success | Final audit reports `closed-valid`. |
| Failure | Follow the returned blocker or recovery action; do not rewrite status/evidence by hand. |
| Human-visible result | Completed outcome, evidence summary, residual risk, or explicit blocker. |

## What the human sees

The human does not need a catalogue of lifecycle commands. The useful result is much smaller:

- why the agent resumed an existing capsule or created a new one;
- which goal, scope, and acceptance contract it followed;
- what validation and evidence support the result;
- whether close reached `closed-valid` or returned a concrete blocker;
- what blocker, question, or next task, if any, remains.

The [Project Protocol Files](#project-protocol-files) page explains how status, read maps, `TASK.md`, and `HANDOFF.md` carry that context across sessions.
