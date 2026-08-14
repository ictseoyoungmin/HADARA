---
id: workflow
group: Core model
label: Lifecycle Workflow
short: The agent's status-first, proof-last work loop.
icon: workflow
eyebrow: Agent loop
title: The agent reads current state, does bounded work, and proves the close.
lead: This is the end-to-end narrative of a HADARA task: orient, establish the contract, implement, validate, preserve evidence, and close with proof.
callout: This page explains how the stages connect and what persists between them. Task Commands is the atomic reference for status, create, and close; Evidence & Validation covers proof-producing commands.
audience: shared
commandAudience: agent-protocol
order: 10
---

## 01 · Select
### Current instruction wins
The agent starts from the current human/reviewer request, then uses `task status` to find matching active work or a justified creation path.

## 02 · Execute
### Keep the task contract current
The agent updates implementation, checks, evidence, risks, acceptance, and handoff as the task evolves—not after the fact from memory.

## 03 · Close
### Proof is appended last
Close validates the virtual post-write state, applies bounded lifecycle writes, records readiness/close evidence, and performs final audit.

## Agent protocol trace

This is the normal agent loop. The human does not normally type it line by line.

```shell
hadara task status --json
hadara task status --task T-XXXX --json
hadara task create "task title" --json
# Agent implementation work: update source, tests, and task-owned docs inside the capsule.
hadara validation run --task T-XXXX --check "Focused tests" -- npm test
hadara task close --task T-XXXX --json
```

This trace shows the whole operating loop, not every option or response field. For exact command semantics, agents and integrations use [Task Commands](#cli-task-lifecycle) and [Evidence & Validation](#cli-evidence-validation).

## Lifecycle diagram

```hadara-diagram
agent-lifecycle
```

The connected stage line keeps the whole loop visible while the compact contract panel explains what one stage reads, produces, and invokes. The durable foundation below the flow is what lets a later agent resume without reconstructing the project from chat history. The human normally supplies the request and reviews the result; the coding agent executes these stages through HADARA.

## What persists between sessions

| Durable surface | Continuity it preserves |
|---|---|
| `docs/TASK_BOARD.md` | Project-level index of known capsules, paths, and persistent status. |
| Active `TASK.md` | Bounded goal, scope, plan, acceptance, validation, constraints, changes, and risk. |
| `evidence.jsonl` / `EVIDENCE.md` | Append-only proof and its human-readable projection. |
| `HANDOFF.md` | Last completed result, current waiting state or blocker, and valid post-close continuation. |

Transient model reasoning and old chat history are not project authority. A later agent resumes from status, routed project documents, the selected capsule, and durable evidence.

## Failure remains part of the record

A failed check is not overwritten by a later pass. The agent appends the failure, repairs the cause, records the follow-up result, and links the resolution. This preserves the difference between “never failed” and “failed, then was demonstrably fixed.”

See [Evidence & Projections](#evidence) for the canonical-versus-human-readable model.

## Close entry gate

Before ordinary close, the agent ensures the capsule has a concrete Goal, relevant Source Documents or an explicit none, a real Plan, Acceptance, Validation, satisfying Evidence, and current close-time Handoff.

## Current-state routing

`task status --json` is the normal public ingress. The agent then reads the selected Task Capsule and registered read-map sources.

## Close is proof-last

`task close --json` owns the guarded transaction and succeeds only when final audit reaches `closed-valid`. When a human or automation boundary must carry an explicitly reviewed plan, use the dry-run and plan-hash form documented in [Task Commands](#cli-task-lifecycle). Never reuse an old plan hash after close-source files change.

## Stop boundary

When the agent encounters a blocker, stale proof, or conflicting project state, it records the condition and stops at the correct layer. It must not turn an unexecuted check into passed evidence or make the human replay the lifecycle merely to recover state.
