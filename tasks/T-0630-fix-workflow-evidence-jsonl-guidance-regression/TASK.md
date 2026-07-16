# T-0630 Fix workflow evidence-jsonl guidance regression

## Identity

| Field | Value |
|---|---|
| ID | T-0630 |
| Title | Fix workflow evidence-jsonl guidance regression |
| Status | Done |
| Created | 2026-07-16 |
| Updated | 2026-07-16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0630 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Restore the exact evidence log guidance required by task workflow docs tests after the 0.4.6 stable source-prep line. | The clean publish helper reported `task-workflow-docs.test.ts` failing because `docs/HADARA_WORKFLOW.md` no longer contained the exact sentence `Do not hand-edit evidence.jsonl`. |

## Scope

| Boundary | Items |
|---|---|
| In | Add the exact `Do not hand-edit \`evidence.jsonl\`.` sentence to the current workflow doc and generated init workflow template; run the focused docs test and build/refresh as needed. |
| Out | Broader workflow-doc rewrites, evidence writer changes, release publication. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reproduce/inspect the failing workflow-doc assertion. | Done |
| 2 | Restore the exact evidence guidance in current docs and init template. | Done |
| 3 | Run focused workflow-doc test and refresh built dist. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `docs/HADARA_WORKFLOW.md` contains the exact sentence `Do not hand-edit \`evidence.jsonl\`.` | Met | `ev:T-0630:4886c561a6b94b4bb971843a` | `docs/HADARA_WORKFLOW.md` |
| AC-2 | Fresh init template emits the same exact evidence guidance. | Met | `ev:T-0630:f07141120af546d3a0c44d82` | `src/init/templates.ts` |
| AC-3 | Focused workflow-doc regression test passes. | Met | `ev:T-0630:4886c561a6b94b4bb971843a` | `tests/unit/task-workflow-docs.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run test:focused -- tests/unit/task-workflow-docs.test.ts` | Yes | Passed | `ev:T-0630:4886c561a6b94b4bb971843a` |
| `npm run dev:docker-sync-build` | Yes | Passed | `ev:T-0630:f07141120af546d3a0c44d82` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| clean publish helper test output | reference | active | Failed exact workflow-doc assertion from release prep clone. |
| `tests/unit/task-workflow-docs.test.ts` | reference | active | Defines required operator guidance text. |

## Changes

| Area | Summary |
|---|---|
| Workflow docs | Added exact canonical evidence-jsonl no-hand-edit sentence. |
| Init template | Added the same sentence so fresh generated `docs/HADARA_WORKFLOW.md` stays aligned. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | None. | Closed | N/A |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-16 | Draft | Initial task scaffold. |
| 2026-07-16 | In Progress | Restoring exact evidence-jsonl guidance required by workflow docs tests. |
| 2026-07-16 | Done | Focused workflow-doc regression and Docker sync-build passed. |
