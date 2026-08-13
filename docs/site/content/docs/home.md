---
id: home
group: Start here
label: Home
short: What the human does, what the agent does, and where HADARA sits.
icon: compass
eyebrow: Local-first evidence control plane
title: You set intent.\nAgents run the protocol.
lead: HADARA lets a human state goals and constraints while a coding agent runs the repeatable task, validation, evidence, and close protocol. The workspace keeps the state and proof reviewable after the session changes.
callout: After initialization, you normally do not type lifecycle commands yourself. The agent operates the protocol; you review the result and approve explicit boundaries.
audience: human
order: 1
---

## 01 · Human
### Initialize, then state intent
Install HADARA, initialize the project boundary, and tell your coding agent what you want changed. Human input stays at the level of goals, constraints, review, and explicit approvals.

## 02 · Agent
### Use HADARA as the work protocol
The agent starts from current state, resumes or creates the right Task Capsule, performs bounded work, runs checks, appends evidence, and closes only when the proof is current.

## 03 · Review
### Read projections, not internal logs
HADARA keeps machine-authoritative state and exposes human-readable projections so you can inspect what happened without operating the evidence machinery by hand.

## The intended interaction model

| Actor | Normal responsibility | Typical interaction |
|---|---|---|
| Human | Set intent, constraints, priorities, and approvals. | Initialize once, then talk to the agent in natural language and review its result. |
| Coding agent | Execute the development loop. | Calls status, task, validation, evidence, and close CLI surfaces. |
| HADARA | Preserve project state and proof across sessions. | Returns read models, guards writes, appends evidence, and derives close state. |
| Human-readable projection | Make machine state inspectable. | Shows authoritative state for review; it is not necessarily the source of truth. |

## What this feels like

```text
Human:  "Add retry backoff. Keep compatibility and run the focused tests."
                         │
                         ▼
Agent:   status → task → work → validation/evidence → close
                         │
                         ▼
Human:  reviews the change, summary, evidence projection, and approval boundaries
```

Not this:

```text
Human manually types every HADARA lifecycle and evidence command.
```

## The control plane

![Human intent, agent protocol, canonical state, and projections](hadara-operating-model.svg)

HADARA is the local protocol between human intent, agent execution, authoritative project state, and review surfaces. It does not replace the coding model, CI provider, source-control host, or release platform.

## Agent protocol trace

The following commands are normally executed by the coding agent, not copied step-by-step by the human:

```shell
hadara task status --json
hadara task create "ship the smallest useful change" --json
hadara validation run --task T-0001 --check "Focused tests" -- npm test
hadara task close --task T-0001 --json
```

Use the reviewed dry-run plus plan-hash form only when a human or automation boundary must explicitly carry the close plan.

## Human-readable projections

`evidence.jsonl` is canonical append-only evidence. `EVIDENCE.md` is a generated human-readable projection. The human reads the projection; the agent/tooling maintains evidence through supported CLI paths. A projection must not invent success, hide unresolved failure, or become a second evidence database.

## RC6 source state

This documentation targets the current **HADARA 0.5.0-rc.6 source candidate**. Stable remains `0.4.6`; RC publication and deployment are separate release-authority decisions.
