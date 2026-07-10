# T-0569 Fix fresh init dogfood UX regressions

## Identity

| Field | Value |
|---|---|
| ID | T-0569 |
| Title | Fix fresh init dogfood UX regressions |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Fix fresh-init dogfood UX regressions found in T-0568. | Remove stale bootstrap task recommendations, HADARA-dev-specific validation leakage, weak TASK.md read-first actions, and generic selected-task status guidance for finish-only blockers. |

## Scope

| Boundary | Items |
|---|---|
| In | Task selection nextWork suppression, context graph/pack validation and read-first guidance, selected-task status next action, focused tests, Docker build/dist refresh. |
| Out | Tool-host child-process EPERM investigation and broad session-start degraded wording changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Update task contract from T-0568 findings. | Done |
| 2 | Fix task selection, context pack, and status guidance. | Done |
| 3 | Add focused regression coverage. | Done |
| 4 | Validate, refresh dist, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh projects with at least one task no longer recommend creating another first capsule from scaffold `nextWork`. | Met | `ev:T-0569:1e2889a1a1c8460496ba3a3e` | `tests/unit/task-selection.test.ts` |
| AC-2 | Generic context pack no longer emits HADARA-dev-only `npm run test:focused -- tests/unit/context-graph-builder.test.ts`. | Met | `ev:T-0569:1e2889a1a1c8460496ba3a3e` | `tests/unit/context-graph-builder.test.ts`, `tests/unit/context-pack.test.ts` |
| AC-3 | Context pack does not suggest a useless `TASK.md --from 1 --to 1` read-first action. | Met | `ev:T-0569:1e2889a1a1c8460496ba3a3e` | `tests/unit/context-pack.test.ts` |
| AC-4 | Selected-task status surfaces finalize guidance when the only blocker is finish bookkeeping. | Met | `ev:T-0569:1e2889a1a1c8460496ba3a3e` | `tests/unit/workbench-next-actions.test.ts` |
| AC-5 | Validation evidence is recorded. | Met | `ev:T-0569:1e2889a1a1c8460496ba3a3e` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused regression tests | Yes | Passed | `ev:T-0569:1e2889a1a1c8460496ba3a3e` |
| TypeScript build | Yes | Passed | `ev:T-0569:1e2889a1a1c8460496ba3a3e` |
| Docker sync build | Yes | Passed | `ev:T-0569:1e2889a1a1c8460496ba3a3e` |
| Fresh governed context-pack smoke | Yes | Passed | `ev:T-0569:1e2889a1a1c8460496ba3a3e` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0568 dogfood report | reference | active | Repro details for the four product UX findings fixed here. |
| AGENTS.md / HADARA workflow | constraint | active | Use current task lifecycle and Docker dist refresh for CLI changes. |

## Changes

| Area | Summary |
|---|---|
| Task selection | Suppressed scaffold `Create first Task Capsule` current-state recommendations after any task row or capsule exists. |
| Context graph / pack | Removed generic HADARA-dev focused-test validation leakage, deduplicated validation suggestions, and widened single-line read-first slices. |
| Task status next actions | Added finalize-auto guidance for finish-only Task Board bookkeeping blockers. |
| Tests / dist | Added regression coverage and refreshed workspace `dist` through Docker sync-build. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Tool-host `validation run` EPERM remains outside this capsule. | Open | `tasks/T-0568-fresh-init-dogfood-from-temporary-project/DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Started fixing T-0568 fresh-init dogfood UX findings. |
| 2026-07-10 | Done | Implemented fixes, validated regression coverage, refreshed dist, and recorded evidence. |
