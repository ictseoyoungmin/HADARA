---
id: workflow
group: Core model
label: Lifecycle Workflow
short: The agent's status-first, proof-last work loop.
icon: workflow
eyebrow: Agent loop
title: The agent reads current state, does bounded work, and proves the close.
lead: HADARA's lifecycle is compressed for agent execution: status to orient, create only when necessary, evidence while working, and one guarded close transaction at the end.
callout: Humans normally state the goal and review the result. The lifecycle below describes what the coding agent executes on their behalf.
audience: agent-protocol
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
hadara validation run --task T-XXXX --check "Focused tests" -- npm test
hadara task close --task T-XXXX --json
```

## Lifecycle diagram

![Status, contract, implementation, validation, evidence, and close](hadara-lifecycle.svg)

## Close entry gate

Before ordinary close, the agent ensures the capsule has a concrete Goal, relevant Source Documents or an explicit none, a real Plan, Acceptance, Validation, satisfying Evidence, and current close-time Handoff.

## Current-state routing

`task status --json` is the normal public ingress. The agent then reads the selected Task Capsule and registered read-map sources. `context graph --task T-XXXX --json` is an explicit diagnostic projection; removed public `context pack` routing must not be presented as the normal path.

## Close is proof-last

`task close --json` owns the guarded transaction and succeeds only when final audit reaches `closed-valid`. A reviewer may use:

```shell
hadara task close --task T-XXXX --dry-run --json
hadara task close --task T-XXXX --execute --plan-hash sha256:<hash> --json
```

Do not carry an old plan hash after close-source files change.

## Stop boundary

When the agent encounters a blocker, stale proof, or an external approval boundary, it records the condition and stops at the correct layer. It must not turn an unexecuted check into passed evidence or make the human replay internal lifecycle commands merely to recover state.
