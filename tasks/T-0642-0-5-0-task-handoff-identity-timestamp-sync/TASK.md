# T-0642 0.5.0 task handoff identity timestamp sync

## Identity

| Field | Value |
|---|---|
| ID | T-0642 |
| Title | 0.5.0 task handoff identity timestamp sync |
| Status | Done |
| Created | 2026-07-17T22:13 |
| Updated | 2026-07-17T22:25 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0642 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Add task-local Identity timestamps and HANDOFF Identity synchronization. | `TASK.md` and task-local `HANDOFF.md` should identify the capsule without relying on path context, and new Identity Created/Updated values should use local `YYYY-MM-DDTHH:mm` timestamps. |

## Scope

| Boundary | Items |
|---|---|
| In | Task scaffold timestamps, template timestamps, task-local HANDOFF Identity table, finalize finish bookkeeping sync, validation format acceptance, docs/tests. |
| Out | Migrating historical task capsules, changing evidence timestamps, adding timezone suffixes to task Identity tables. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement scaffold and finalize identity synchronization. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | New `TASK.md` Identity Created/Updated values use `YYYY-MM-DDTHH:mm` local timestamps. | Done | `ev:T-0642:1b2689fabdf44ee2bb969833` | `src/task/task-capsule.ts`, `src/task/task-templates.ts` |
| AC-2 | New `HANDOFF.md` files include an Identity table with ID, Title, Status, Created, and Updated. | Done | `ev:T-0642:1b2689fabdf44ee2bb969833` | `src/task/task-capsule.ts` |
| AC-3 | Finalize finish bookkeeping synchronizes task-local `HANDOFF.md` Identity status and Updated timestamp when closing Draft/In Progress work. | Done | `ev:T-0642:1b2689fabdf44ee2bb969833` | `src/task/task-finish.ts` |
| AC-4 | Done-level validation accepts legacy date-only and new local minute timestamp Identity values. | Done | `ev:T-0642:1b2689fabdf44ee2bb969833` | `src/harness/validate.ts` |
| AC-5 | Validation evidence is recorded. | Done | `ev:T-0642:1b2689fabdf44ee2bb969833`, `ev:T-0642:bac8c1d8cbc646ddaffe1cb5` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run test:focused -- tests/harness/task-capsule.test.ts tests/unit/task-finalize.test.ts tests/harness/harness-validate.test.ts tests/unit/task-workflow-docs.test.ts` | Yes | Passed | `ev:T-0642:1b2689fabdf44ee2bb969833` |
| `npm run build` | Yes | Passed | `ev:T-0642:bac8c1d8cbc646ddaffe1cb5` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | requirement | active | Add task-local HANDOFF Identity and use local `YYYY-MM-DDTHH:mm` timestamps in TASK/HANDOFF Identity. |

## Changes

| Area | Summary |
|---|---|
| Task scaffold | New capsules use local minute timestamps and task-local HANDOFF Identity. |
| Finalize finish | HANDOFF Identity sync is bounded to real finish bookkeeping. |
| Validation | Metadata format accepts date-only legacy values and local minute timestamps. |
| Docs | Ownership docs distinguish HANDOFF Identity from handoff prose. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Historical capsules are not migrated; they can keep date-only metadata unless touched by future migration work. | Open | Future migration capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-17 | Draft | Initial task scaffold. |
| 2026-07-17 | In Progress | Implemented task-local Identity timestamp and HANDOFF sync changes. |
| 2026-07-17 | Done | Validated focused task identity tests and TypeScript build. |
