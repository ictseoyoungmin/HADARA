# T-0501 0.4.1 rc0 generated project dogfood and markdown review

## Identity

| Field | Value |
|---|---|
| ID | T-0501 |
| Title | 0.4.1 rc0 generated project dogfood and markdown review |
| Status | Done |
| Created | 2026-07-07 |
| Updated | 2026-07-07 |

## Goal

| Goal | Notes |
|---|---|
| Dogfood the current built HADARA CLI from `hadara init` through normal lifecycle and representative command families in a temporary project, then review every generated Markdown guide for instruction clarity and current-surface consistency. | This is a release-smoke precursor, not the publish/release smoke itself. |

## Scope

| Boundary | Items |
|---|---|
| In | Temporary governed project init; generated Markdown review (`AGENTS.md`, `.hadara/context/HADARA_CONTEXT.md`, generated docs); lifecycle (`task create/status/finalize --auto`); representative command families (`schema`, `docs`, `slice`, `validation`, `evidence`, `policy`, `hermes/context`, `commands/help`, removed-command stubs); structured dogfood report under this capsule. |
| Out | Publishing, npm install recycle, GitHub Release work, broad command-portfolio deletion, full 0.5 state-first implementation, and destructive command execution outside the temporary project. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the dogfood matrix and create a disposable initialized project. | Done |
| 2 | Exercise lifecycle and representative command families, capturing pass/fail/friction. | Done |
| 3 | Review generated Markdown guidance for stale commands, unclear ownership, and lifecycle inconsistencies. | Done |
| 4 | Write a structured report and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A fresh temporary governed project is initialized and generated Markdown files are reviewed for current 0.4.1-rc.0 workflow consistency. | Met | `ev:T-0501:001b43dc22cf4c41a4d3de0a` | User request |
| AC-2 | Lifecycle dogfood reaches `closed-valid` using current recommended surfaces (`task status`, `validation run`, `task finalize --execute --auto`) without relying on removed low-level lifecycle commands. | Met | `ev:T-0501:001b43dc22cf4c41a4d3de0a` | `docs/HADARA_WORKFLOW.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |
| AC-3 | Representative non-lifecycle CLI families are exercised and any failures or confusing output are categorized. | Met | `ev:T-0501:001b43dc22cf4c41a4d3de0a` | User request |
| AC-4 | Findings are written as a structured Markdown report under this capsule; unrelated local feedback, if any, is written under `.hadara/local/feedback/` and kept uncommitted. | Met | `ev:T-0501:001b43dc22cf4c41a4d3de0a` | `DOGFOOD_REPORT.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Temporary project CLI dogfood matrix | Yes | Passed | `ev:T-0501:001b43dc22cf4c41a4d3de0a` |
| Generated Markdown review | Yes | Passed | `ev:T-0501:001b43dc22cf4c41a4d3de0a` |
| Focused Docker tests and build | Yes | Passed | `ev:T-0501:ec05ac1dad9c49909be2444e` |
| Harness validate T-0501 | Yes | Passed | `ev:T-0501:45346891d51e4028a1a95a8b` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `AGENTS.md` | constraint | approved | HADARA lifecycle and feedback rules. |
| `docs/HADARA_WORKFLOW.md` | constraint | approved | Current workflow guide replacing SOP. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | approved | Current lifecycle command guidance and removed-command routing. |
| `docs/specs/0.4.1/rc0-scope.md` | reference | approved | rc0 command-surface and slices-state context. |

## Changes

| Area | Summary |
|---|---|
| Generated init workflow docs | Updated generated `docs/HADARA_WORKFLOW.md` guidance to prefer `task finalize --execute --auto`, describe explicit plan-hash as external-review flow, and document removed lifecycle stubs. |
| Protocol profile diagnostics | Aligned profile document-set detection with the current slim init scaffold so fresh governed init is protocol-clean. |
| Required Reading parser | Ignored non-path task-local doc tokens such as `HANDOFF.md` and `EVIDENCE.md` when checking AGENTS Required Reading file existence. |
| Finalize/status reports | Replaced removed lifecycle commands in copyable report fields with `task finalize`/`task status` equivalents and marked `task lifecycle` as removed. |
| Dogfood report | Added `DOGFOOD_REPORT.md` with CLI matrix, generated Markdown review, friction, good points, and follow-up candidates. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Improve stateConsistency missing-slices wording to suggest `hadara slice add` or `hadara slice migrate --execute`. | Open | `DOGFOOD_REPORT.md` |
| RF-2 | Follow-up | Investigate `validation run` child-process `EPERM` in this tool environment while direct `node --version` passes. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-07 | Draft | Initial task scaffold. |
| 2026-07-07 | In Progress | Scoped to temporary-project dogfood and generated Markdown instruction review. |
| 2026-07-07 | Done | Dogfood completed, defects fixed, report/evidence recorded. |
