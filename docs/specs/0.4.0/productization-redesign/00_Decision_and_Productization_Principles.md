# 00 Decision and Productization Principles

## Decision

HADARA 0.4.0 is a breaking productization protocol line.

HADARA 0.4 intentionally drops the 0.3.x expanded scaffold and dual-layout compatibility model. A HADARA 0.4 project has one task schema, one workflow-document model, one close-source contract, and one docs read-map model.

## Non-Negotiable Boundary

A HADARA 0.4 CLI must not silently mutate a HADARA 0.3.x project.

When a legacy project is detected, mutation commands fail closed with a diagnostic such as:

```text
HADARA_LEGACY_PROJECT_UNSUPPORTED
```

The diagnostic should explain:

```text
This project appears to use a HADARA 0.3.x scaffold.
HADARA 0.4 does not support legacy project mutation.
Use the 0.3.x package line for this project, or initialize a new HADARA 0.4 project.
```

## Productization Goal

HADARA 0.4 should feel like a productized workbench, not a large Markdown protocol.

The user supplies requirements, design source documents, or operator instructions. The agent derives structured task docs. HADARA validates schema, tokens, evidence, close-source integrity, and read-map state.

## Product Generalization Boundary

HADARA-dev uses HADARA to build HADARA, but HADARA product defaults must not be specialized for HADARA-dev.

The 0.4 scaffold and generated workflow docs must not assume a TypeScript CLI, Node/npm, Docker validation, npm publish, this repository's release line, or HADARA's own internal task history. Those belong in the HADARA-dev project docs and Task Capsules, not in product defaults.

Generated content may describe generic concepts such as validation, release approval, package boundaries, project-specific docs, and integration enablement. Project-specific commands and environments are registered by the project after init.

## Product Principles

| Principle | Meaning |
|---|---|
| One normal path | New 0.4 projects use one Task Capsule schema. No layout choice is shown to ordinary users. |
| Read models before broad reading | Agents should use `session start`, `context pack`, and docs read maps before broad manual file scans. |
| Single owner per state token | A semantic state value has exactly one canonical owner. Other appearances are projections or indexes. |
| Evidence is append-only | `evidence.jsonl` is canonical. `EVIDENCE.md` is a projection. |
| Close-source docs stay stable | Close proof is not written into close-source docs after close. |
| Handoff is continuation, not proof | Task-local `HANDOFF.md` guides the next worker and is not a default close-source file. |
| Design sources are governed | `docs/specs/**` files may be rough, approved, normative, implemented, or drift-risk. Registry metadata decides read behavior. |
| Safety stays visible | `AGENTS.md` remains short but preserves safety and mutation boundaries. |
| Workflow guidance is centralized | CLI usage guidance lives in `docs/HADARA_WORKFLOW.md`, not duplicated across entry docs. |
| Authoring guidance is centralized | Agent/CLI/human ownership rules live in `docs/HADARA_WORKFLOW.md` and registries, not repeated as long comments in every capsule. |
| Product defaults stay generic | HADARA-dev-specific validation, release, and repository conventions are project-specific docs, not scaffold defaults. |
| Legacy fails closed | 0.4 does not attempt automatic migration of old project protocols. |

## Document Planes

| Plane | Files | Role |
|---|---|---|
| Machine Control Plane | `.hadara/scaffold.json`, `.hadara/docs-registry.json`, `.hadara/slot-registry.json` | Machine-owned protocol, docs, and slot metadata. |
| Agent Entry Plane | `AGENTS.md`, `.hadara/context/HADARA_CONTEXT.md` | Stable entry rules and compact routing anchor. |
| Workflow Reference Plane | `docs/HADARA_WORKFLOW.md` | When and why to use project start, lifecycle, context, evidence, docs, diagnostics, and task document updates. |
| Design Source Plane | `docs/specs/**`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md` | Requirements, specifications, decisions, and plans. |
| Project State Plane | `docs/PROJECT_STATE.md`, `docs/TASK_BOARD.md`, optional `docs/AGENT_HANDOFF.md` | Current state and task index. |
| Task Execution Plane | `tasks/T-*/TASK.md`, `HANDOFF.md`, `evidence.jsonl`, `EVIDENCE.md` | Scoped implementation contract, continuation, canonical evidence, and projection. |
| Projection / Report Plane | CLI JSON reports, generated evidence summaries, read maps | Derived reports; not hand-authored source of truth. |

## Removed Concepts

The following concepts are not part of the 0.4 redesign:

```text
--layout compact
--layout expanded
--capsule-layout compact-v1
--capsule-layout expanded-v1
task layout
task migrate-layout
dual layout parsing
mixed layout support
automatic legacy project migration
```
