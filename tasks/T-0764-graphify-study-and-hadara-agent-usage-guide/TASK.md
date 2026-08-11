# T-0764 Graphify Study and HADARA Agent Usage Guide

## Identity

| Field | Value |
|---|---|
| ID | T-0764 |
| Title | Graphify Study and HADARA Agent Usage Guide |
| Status | Done |
| Created | 2026-08-11T14:41 |
| Updated | 2026-08-11T14:51 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0764 --json`.

## Goal

| Goal | Notes |
|---|---|
| Study the installed Graphify workflow on HADARA-dev and publish one reusable agent guide for Graphify-assisted development. | Later agents should be able to find relationships, assess refactoring impact, refresh the local graph, and hand findings back to HADARA validation without repeating this study. |

## Scope

| Boundary | Items |
|---|---|
| In | Exercise the installed Graphify CLI and existing `graphify-out/graph.json`; document freshness, `explain`, `affected`, `path`, `query`, `god-nodes`, `diagnose`, and `benchmark`; document add/change/move/refactor workflows; register the guide. |
| Out | Graphify source changes, HADARA runtime changes, MCP installation into agent configuration, committed graph artifacts, treating Graphify as evidence or source-of-truth, and broad generated-output cleanup. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the study scope, authority boundary, and HADARA usage goals. | Done |
| 2 | Exercise installed Graphify against the existing HADARA-dev graph. | Done |
| 3 | Write and register the reusable agent-facing guide. | Done |
| 4 | Validate documentation, registry, and command examples; record evidence. | Done |
| 5 | Finish the three-file handoff and prepare the proof-last close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The capsule records a reproducible Graphify study against the current HADARA-dev graph. | Met | `ev:T-0764:8c240f8566174ca9a1b14c1d` | `TASK.md`, `EVIDENCE.md` |
| AC-2 | A reusable guide explains commands, refactoring workflows, HADARA authority boundaries, document recency, and limitations. | Met | `ev:T-0764:b8ed77450e2a48a58b651b17` | `docs/GRAPHIFY_FOR_HADARA_AGENTS.md` |
| AC-3 | The guide is registered in the canonical project docs registry without AGENTS/context/workflow prose mutation. | Met | `ev:T-0764:17ea665f3b5848ca867bcadb` | `.hadara/docs-registry.json` |
| AC-4 | Documentation and command examples pass whitespace, link, and registry validation. | Met | `ev:T-0764:17ea665f3b5848ca867bcadb` | `TASK.md`, `EVIDENCE.md` |
| AC-5 | Capsule evidence and handoff are complete before proof-last close. | Met | `ev:T-0764:17ea665f3b5848ca867bcadb` | `HANDOFF.md`, `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Graphify study command suite | Yes | Passed | `ev:T-0764:8c240f8566174ca9a1b14c1d` |
| Guide registration and docs registry projection | Yes | Passed | `ev:T-0764:17ea665f3b5848ca867bcadb` |
| Markdown/link/whitespace validation | Yes | Passed | `ev:T-0764:17ea665f3b5848ca867bcadb` |
| Historical/archive document authority follow-up | Yes | Passed | `ev:T-0764:b8ed77450e2a48a58b651b17` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `AGENTS.md` | constraint | active | Required HADARA reading and safety boundary. |
| `docs/HADARA_WORKFLOW.md` | constraint | active | Task/document/evidence timing and command routing. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Capsule lifecycle, evidence, and close rules. |
| `docs/DEVELOPMENT_SLICES.md` | reference | active | Confirms the study is a standalone documentation capsule, not a runtime slice. |
| Installed Graphify CLI and local graph | background | active | Read-only Graphify exploration performed against `graphify-out/graph.json`. |
| `docs/GRAPHIFY_FOR_HADARA_AGENTS.md` | implementation-source | active | Reusable instructions for future agents. |

## Changes

| Area | Summary |
|---|---|
| Documentation | Added a Graphify-for-HADARA guide with exact commands, refactoring workflows, safety/authority boundaries, and limitations. |
| Capsule | Kept the study context, decisions, risks, validation, acceptance criteria, and handoff guidance in the current three-file capsule structure. |
| Registry | Registered the guide as an active, conditional-reference implementation guide; no AGENTS/context/workflow prose mutation was performed. |
| Evidence | Recorded three durable public evidence records, including the reopen follow-up and recency/authority validation. |
| Follow-up | Reopened the capsule at operator request to document historical/archive document authority and Graphify recency limits. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Graphify remains static and can miss runtime/dynamic registry behavior. | Mitigated | `docs/GRAPHIFY_FOR_HADARA_AGENTS.md` |
| RF-2 | Follow-up | Current graph contains mixed source, tests, task artifacts, and documents, so broad queries can be noisy. | Mitigated | `docs/GRAPHIFY_FOR_HADARA_AGENTS.md` |
| RF-3 | Follow-up | Graphify relevance does not establish document recency or authority. | Mitigated | `docs/GRAPHIFY_FOR_HADARA_AGENTS.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Ran the installed Graphify study and drafted the reusable agent guide. |
| 2026-08-11 | Done | Completed the Graphify guide, registry registration, evidence, and validation; proof-last close remains. |
| 2026-08-11 | In Progress | Reopened by operator request to add explicit historical/archive document authority guidance. |
| 2026-08-11 | Done | Added recency/authority routing guidance and prepared the capsule for proof-last reclose. |
