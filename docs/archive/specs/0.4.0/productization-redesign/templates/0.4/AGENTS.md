# AGENTS

This repository uses the HADARA protocol for scoped, evidenced, resumable AI-assisted development.

## Required Reading

| Document | When to Read | Purpose |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Every session | Compact project-local context anchor and read-routing guide. |
| `docs/PROJECT_STATE.md` | Every session | Current state, active work, known problems, and next recommended step. |
| `docs/TASK_BOARD.md` | Every session | Task queue, task status, and capsule paths. |
| `docs/HADARA_WORKFLOW.md` | Every session; whenever using HADARA CLI workflow commands | Project start, task lifecycle, evidence, context, document timing, repair, and useful CLI guidance. |
| `docs/AGENT_HANDOFF.md` | When present in governed or long-running projects | Compact continuation handoff and current coordination notes. |
| Active `tasks/T-*/TASK.md` | Every task-work session | Task scope, source documents, plan, acceptance, validation, and change summary. |
| Active Task Capsule `HANDOFF.md` and `EVIDENCE.md` | Resuming, validating, finishing, or handing off a task | Continuation guidance and human-readable evidence projection. |
| Project-specific docs referenced by the task, registry, or read-map | When referenced | Task-specific architecture, design, roadmap, validation, security, or integration constraints. |

`AGENTS.md` owns Required Reading. `.hadara/context/HADARA_CONTEXT.md` is a compact routing anchor that points to current-state and workflow documents; it is not a second Required Reading authority.

## Required Reading Tiers

| Tier | Meaning | Default Read Behavior |
|---|---|---|
| `current-state` | Compact docs that establish live project state and route deeper reading. | Read first at session start or resume. |
| `workflow` | Shared HADARA workflow and command-use guidance. | Read before selecting, creating, implementing, finishing, closing, or auditing tasks. |
| `task-work` | Active Task Capsule docs and task-local evidence/handoff surfaces. | Read when working inside a task. |
| `conditional-reference` | Architecture, roadmap, decisions, validation, security, integration, or project-specific specs. | Read only when the task or read-map points to them. |
| `historical` | Completed-task history and older validation records. | Do not read by default; use only when investigating history. |
| `excluded` | Superseded, archived, local-only, or intentionally non-default material. | Do not read unless explicitly reclassified. |

## Operating Rules

- Work inside one Task Capsule whenever possible.
- If no suitable Task Capsule exists, create one through the HADARA workflow before implementation.
- Prefer HADARA read models before broad manual file reading.
- Keep committed state reproducible and project-local.
- Do not write secrets, private logs, raw transcripts, credentials, or machine-local state into committed files.
- Do not hand-edit canonical evidence logs.
- Do not mark work done without evidence.
- Keep Task Capsule docs current as work changes; do not defer all documentation until after implementation.
- Do not execute destructive commands.
- Do not run release, publish, package, installer, or other external mutation workflows without explicit operator approval.

## Workflow Reference

Use `docs/HADARA_WORKFLOW.md` for project start, task lifecycle, context, evidence, document timing, repair, docs read-map, and useful CLI guidance.

## Project Context

Use `.hadara/context/HADARA_CONTEXT.md` as the compact project-local context anchor.
