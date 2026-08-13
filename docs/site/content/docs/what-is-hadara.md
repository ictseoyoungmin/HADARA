---
id: what-is-hadara
group: Core model
label: What is HADARA?
short: A control plane and agent protocol, not another agent runtime.
icon: orbit
eyebrow: Product boundary
title: A continuity and evidence layer around agents.
lead: HADARA gives a coding agent a deterministic project protocol while preserving authoritative state and human-reviewable proof outside any single chat session.
callout: The human supplies intent. The agent operates the protocol. HADARA preserves the state. Projections make that state reviewable.
audience: shared
order: 3
---

## 01 · Protocol
### CLI for agents and automation
HADARA's CLI is a deterministic local API that coding agents and automation call while doing project work. It is not primarily a sequence of terminal chores for the human developer.

## 02 · State
### Authority survives the agent
Task Capsules, structured project state, registered docs, and append-only evidence live with the workspace rather than in one model's conversation context.

## 03 · Projection
### Humans inspect without becoming the state machine
HADARA exposes Markdown and read models that project machine-authoritative state into a form humans can review.

## The three-layer mental model

![HADARA's human, agent, state, and projection layers](hadara-operating-model.svg)

| Layer | Purpose | Example |
|---|---|---|
| Canonical state | Source of truth for a domain. | `evidence.jsonl`; validated `.hadara/` state. |
| Read model / protocol report | Machine-oriented interpretation for the next safe action. | `task status --json`; close dry-run. |
| Human-readable projection | Review-oriented representation of authoritative state. | `EVIDENCE.md`; generated Markdown. |

“Projection” does not mean “a second truth.” If it disagrees with its canonical source, the canonical source wins and the projection is refreshed through its supported ownership path.

## What HADARA owns

| Surface | HADARA responsibility |
|---|---|
| Task Capsules | Keep one unit of work scoped, resumable, and reviewable. |
| Evidence | Append reduced proof without rewriting failure history. |
| Status/read models | Route the next read/action from current project state. |
| Close | Review acceptance, write bounded lifecycle state, append proof, and audit. |
| Document governance | Register and route canonical, active, reference, historical, and archived docs. |
| Release gates | Observe readiness without silently publishing. |

## What HADARA does not own

- model reasoning or model hosting
- source-control hosting or remote CI implementation
- package registry or GitHub Release authority
- broad autonomous writes by default
- reconstructing current state from old chat history

## Where the human normally interacts

The normal human boundaries are:

1. install and initialize HADARA;
2. express goals and constraints to the agent;
3. review the implementation and human-readable projections;
4. approve explicitly guarded or external mutations when policy requires it.

The detailed CLI pages are therefore protocol references for agents, integrations, debugging, and advanced operators—not a checklist every human must execute.
