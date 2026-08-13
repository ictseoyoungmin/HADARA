---
id: what-is-hadara
group: Start here
label: What is HADARA?
short: A harness built for agents, not humans.
icon: orbit
eyebrow: Category & boundary
title: A harness for work that outlives a session.
lead: HADARA is a local-first evidence control plane for agentic development. Its runbook guides behavior, while its artifacts preserve the state needed to resume, review, and release work.
callout: HADARA coordinates evidence-backed development. It does not certify that an agent is fully autonomous or universally safe.
order: 3
---

## Continuity
### State survives sessions
The next agent starts from `hadara task status --json` and the routed Task Capsule/read-map sources, not from old chat memory or broad document scanning.

## Verification
### Claims point to evidence
A task closes only when acceptance and validation are backed by durable evidence records. “The agent says it passed” is not enough.

## Boundaries
### Capabilities stay explicit
HADARA separates read models, task-local writes, evidence appends, lifecycle close, and release authority into distinct surfaces.

## Commands
```shell
hadara task status --json
hadara commands --json
```

## The category

HADARA is a **local-first evidence control plane for agentic development**.

That phrase is precise:

| Term | Meaning |
|---|---|
| Local-first | Project state lives in the repository, not in a cloud service. |
| Evidence | Completion claims must point to inspectable records. |
| Control plane | HADARA coordinates state, routing, gates, and authority boundaries; it does not become the worker itself. |
| Agentic development | The primary operator may be an LLM/coding agent that needs deterministic surfaces and explicit recovery instructions. |

## What HADARA is not

HADARA is not:

- a general autonomous agent runtime
- a model provider abstraction
- a cloud queue
- a CI replacement
- a deployment platform
- a secret manager
- a guarantee that an arbitrary agent is safe

It is the local protocol that keeps agent work bounded, resumable, and reviewable.

## Built for agents first

HADARA’s CLI is an agent API first and a human terminal interface second.

Primary commands return JSON with stable fields such as `schemaVersion`, `command`, `ok`, `phase`, `readiness`, `primaryNextAction`, `issues`, and evidence identifiers. Human-readable Markdown documents are still first-class, but agents should not infer current state by scraping prose when a JSON read model exists.

The default read order is:

1. `hadara task status --json`
2. `hadara task status --task T-XXXX --json`
3. the selected Task Capsule and registered read-map sources
4. only then, the specific files routed by those reports

## The core artifacts

| Artifact | Role |
|---|---|
| `.hadara/project.json` and `.hadara/documents.json` | Init v1 canonical project and document-routing authority |
| `.hadara/context/READ_MAP.md` | Generated compact document-routing projection |
| `docs/PROJECT_STATE.md` | Human-readable projection of selected current-state facts plus product context |
| `docs/TASK_BOARD.md` | Task index and lifecycle status rows |
| `tasks/T-*/TASK.md` | Task contract: goal, scope, acceptance, validation, changes, risks |
| `tasks/T-*/HANDOFF.md` | Close-time continuation guidance for the next session/capsule |
| `tasks/T-*/evidence.jsonl` | Canonical append-only task evidence |
| `tasks/T-*/EVIDENCE.md` | Generated evidence projection for humans |

## Conservative by design

HADARA deliberately keeps write surfaces narrow. It should read broadly enough to route an agent, but it should not silently mutate unrelated project files, rewrite history, publish packages, deploy services, or touch secrets.

This is why many workflows are dry-run-first, why close proof is appended last, and why release publication remains policy-controlled: manual, CI-driven, or hybrid, depending on the project.
