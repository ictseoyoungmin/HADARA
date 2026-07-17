# T-0641 0.5.0 close-time handoff workflow guidance

## Identity

| Field | Value |
|---|---|
| ID | T-0641 |
| Title | 0.5.0 close-time handoff workflow guidance |
| Status | Done |
| Created | 2026-07-17 |
| Updated | 2026-07-17 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0641 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Clarify HANDOFF.md lifecycle timing in workflow guidance. | `HANDOFF.md` can be a WIP checkpoint during work, but before finalize execute it must be converted into close-time handoff so stale next-step prose does not survive close. |

## Scope

| Boundary | Items |
|---|---|
| In | `docs/HADARA_WORKFLOW.md`, generated workflow template, doc regression test. |
| Out | New finalize stale-handoff blocker, historical closed capsule rewrites. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Add close-time handoff conversion guidance to current and generated workflow docs. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Workflow docs say `HANDOFF.md` may be WIP during work but must be converted to close-time handoff before finalize execute. | Done | `ev:T-0641:cdca913e51bb4cdf804149e9` | `docs/HADARA_WORKFLOW.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `src/init/templates.ts` |
| AC-2 | Regression tests cover the new guidance in current and generated workflow docs. | Done | `ev:T-0641:cdca913e51bb4cdf804149e9` | `tests/unit/task-workflow-docs.test.ts` |
| AC-3 | Validation evidence is recorded. | Done | `ev:T-0641:cdca913e51bb4cdf804149e9`, `ev:T-0641:2d93ed9323c046f0bf092fa7` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run test:focused -- tests/unit/task-workflow-docs.test.ts` | Yes | Passed | `ev:T-0641:cdca913e51bb4cdf804149e9` |
| `npm run build` | Yes | Passed | `ev:T-0641:2d93ed9323c046f0bf092fa7` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0634-0-5-0-status-ingress-and-evaluation/HANDOFF.md` | reference | active | Example of stale Next Recommended Step text after follow-up capsules already completed. |

## Changes

| Area | Summary |
|---|---|
| Workflow docs | Clarified WIP handoff vs close-time handoff timing. |
| Init template | Ensures newly initialized projects receive the same guidance. |
| Regression test | Locks current and generated workflow docs to the new guidance. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | A future capsule can add finalize warning diagnostics for stale `HANDOFF.md` references after dogfood proves the heuristic. | Open | Future lifecycle-hardening capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-17 | Draft | Initial task scaffold. |
| 2026-07-17 | In Progress | Added WIP-to-close-time handoff guidance to workflow docs and tests. |
| 2026-07-17 | Done | Validated focused workflow docs test and TypeScript build. |
