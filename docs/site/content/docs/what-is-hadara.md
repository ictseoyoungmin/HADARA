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

| Layer | Purpose | Example |
|---|---|---|
| Canonical state | Source of truth for a domain. | `evidence.jsonl`; validated `.hadara/` state. |
| Read model / protocol report | Machine-oriented interpretation for the next safe action. | `task status --json`; close dry-run. |
| Human-readable projection | Review-oriented representation of authoritative state. | `EVIDENCE.md`; generated Markdown. |

“Projection” does not mean “a second truth.” If it disagrees with its canonical source, the canonical source wins and the projection is refreshed through its supported ownership path.

## What “coding agent” means

HADARA is not tied to a model vendor or a hosted agent service. Here, a **coding agent** means a repository-aware agent runtime that can read project instructions, inspect and edit workspace files, and execute the `hadara` CLI as a local process.

Any agent runtime that discovers `AGENTS.md` can use the HADARA protocol when `hadara` is available on its command path. A runtime that uses another instruction-file convention can still participate, but it needs a one-time project instruction that points it to `AGENTS.md`. There is no hidden HADARA agent connection or mandatory model plugin.

| Connection point | What happens |
|---|---|
| `hadara init` | Writes or safely adopts the project instruction and protocol files. |
| Agent session starts | The runtime discovers `AGENTS.md`, or its own configuration routes it there. |
| `AGENTS.md` | Tells the agent to read current status, the selected capsule, workflow rules, and routed documents. |
| Local CLI process | The agent invokes `hadara task status`, validation/evidence surfaces, and guarded close while doing the engineering work. |
| Repository state | A later agent can resume from the same files even when the model or chat session changes. |

The connection requirements are therefore simple: **instruction discovery (or explicit routing) + workspace access + shell execution**. HADARA does not require the agent runtime to embed a special SDK.

## Two supported work styles

HADARA supports both a tight review loop and a delegated agent loop. They differ in how often the human reviews progress, not in the underlying protocol: both use a bounded Task Capsule, real validation, durable evidence, and guarded close.

![Two supported HADARA work styles](two-supported-work-styles.webp)
*Tight and delegated loops share the same status-first, proof-last contract.*

## Canonical boundaries by domain

HADARA does not treat every generated file as equal authority. Each domain names its own source and projection.

| Domain | Authority | Human/read projection |
|---|---|---|
| Project setup and capabilities | `.hadara/project.json` | Status and doctor reports |
| Document routing | `.hadara/documents.json` | `.hadara/context/READ_MAP.md` |
| Task contract | `tasks/T-*/TASK.md` within its ownership rules | Task status reports |
| Task evidence | `tasks/T-*/evidence.jsonl` | `tasks/T-*/EVIDENCE.md` |

## What HADARA owns

| Surface | HADARA responsibility |
|---|---|
| Task Capsules | Keep one unit of work scoped, resumable, and reviewable. |
| Evidence | Append reduced proof without rewriting failure history. |
| Status/read models | Route the next read/action from current project state. |
| Close | Review acceptance, write bounded lifecycle state, append proof, and audit. |
| Document routing | Register project documents and route the sources relevant to current work. |

## What HADARA does not own

- **Model intelligence:** HADARA does not provide model reasoning or model hosting.
- **Development infrastructure:** it does not replace source-control hosting or a remote CI provider.
- **Chat-memory reconstruction:** current state comes from project files and read models, not an attempt to infer truth from old conversation.

For practical failure recovery, concurrent-agent boundaries, and currently unsupported behavior, read [Limits & Recovery](#limits-and-recovery).

## Start with the human path

For a first project, follow [Getting Started](#getting-started). It covers the short human path; the detailed CLI pages remain references for coding agents and integrations.
