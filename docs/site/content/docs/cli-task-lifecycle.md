---
id: cli-task-lifecycle
group: Agent protocol
label: Task Lifecycle
short: Agent-facing status, create, and close semantics.
eyebrow: Agent protocol reference
title: Three public commands carry the agent task loop.
lead: Status orients, create opens a capsule only when needed, and close owns the guarded lifecycle transaction. These are protocol surfaces for the coding agent and integrations, not commands a normal human must replay for every task.
callout: If you are reading this as an ordinary HADARA user, you can usually stop here: tell the agent what you want and let it execute this protocol.
audience: agent-protocol
order: 21
---

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
hadara task close --task T-0042 --json
hadara task close --task T-0042 --dry-run --json
hadara task close --task T-0042 --execute --plan-hash sha256:... --json
```

## `task status --json`

The agent uses it when no task is selected. It can route to active work, recommend creation when structured next work warrants it, report waiting/terminal state, or surface degraded sources. It does not create tasks or append evidence.

## Selected task status

The default report is compact and fast. Complete close-grade diagnostics are available through `--detail full`. When the specific question is “what would close do now?”, the agent can use close dry-run instead of forcing every loop through heavyweight diagnostics.

## `task close`

Ordinary close is the primary path. The reviewed dry-run + plan-hash form exists when a separate human or automation boundary must explicitly carry the reviewed plan identity.

The transaction reviews the current plan, guards writes, applies lifecycle-owned mutations, records readiness evidence when required, appends close proof last, and runs final audit. Partial close recovery completes by rerunning `task close`; lifecycle-owned fields should not be hand-edited to force closure.

## Removed / non-primary surfaces

New agent-facing flows should not rely on removed public routes such as `task finish`, `task ready`, `task audit-close`, `task complete`, or `task lifecycle`. `task finalize` is compatibility/debug machinery rather than the new primary workflow.

Public `context pack` routing is also removed; selected status plus read maps and exact source reads now carry that routing role.
