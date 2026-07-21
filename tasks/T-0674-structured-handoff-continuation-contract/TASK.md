# T-0674 Structured Handoff Continuation Contract

## Identity

| Field | Value |
|---|---|
| ID | T-0674 |
| Title | Structured Handoff Continuation Contract |
| Status | Done |
| Created | 2026-07-21T22:39 |
| Updated | 2026-07-21T22:45 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0674 --json`.

## Goal

| Goal | Notes |
|---|---|
| Make task-local handoff continuation machine-readable. | `task close` should promote structured `HANDOFF.md` continuation fields into `.hadara/state/current.json` without relying on natural-language phrase detection, while preserving legacy three-column handoff compatibility. |

## Scope

| Boundary | Items |
|---|---|
| In | Structured `Next Recommended Step` table contract, task capsule template update, close-time handoff parsing, continuation disposition/create-task normalization, focused tests, Docker build sync, and workflow docs. |
| Out | Removing legacy three-column handoff compatibility, broad dashboard/TUI rendering redesign, and changing shared `docs/AGENT_HANDOFF.md` projection format beyond current managed state. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement structured handoff continuation parsing and template defaults. | Done |
| 3 | Update workflow docs for the table contract. | Done |
| 4 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | New Task Capsules scaffold `HANDOFF.md` with `Step`, `Disposition`, `Create Task`, `Reason`, and `Required Reading` columns. | Met | ev:T-0674:c84428e499cd422eb344f0dd | `src/task/task-capsule.ts` |
| AC-2 | `task close` promotes structured handoff rows into current-state continuation using explicit disposition/create-task fields. | Met | ev:T-0674:c84428e499cd422eb344f0dd | `src/task/task-finish.ts`, `src/services/project-current-state.ts` |
| AC-3 | Legacy three-column handoff rows remain readable for older capsules. | Met | ev:T-0674:c84428e499cd422eb344f0dd | `tests/unit/status-continuation.test.ts` |
| AC-4 | Workflow docs explain the structured table and warn not to encode terminal state only through phrase detection. | Met | ev:T-0674:c84428e499cd422eb344f0dd | `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/HADARA_WORKFLOW.md` |
| AC-5 | Validation evidence is recorded. | Met | ev:T-0674:c84428e499cd422eb344f0dd | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- --run tests/unit/status-continuation.test.ts tests/unit/continuation-terminal-detection.test.ts tests/unit/task-capsule.test.ts` | Yes | Passed | ev:T-0674:c84428e499cd422eb344f0dd |
| `npm run build` | Yes | Passed | ev:T-0674:c84428e499cd422eb344f0dd |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | ev:T-0674:c84428e499cd422eb344f0dd |
| `npm run dev:docker-sync-build` | Yes | Passed | ev:T-0674:c84428e499cd422eb344f0dd |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer release recycle plan | reference | active | Requires machine-readable handoff continuation semantics. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | implementation-source | active | Owns task lifecycle and handoff close-source contract. |
| `docs/HADARA_WORKFLOW.md` | implementation-source | active | Owns ordinary agent workflow guidance. |
| `src/services/project-current-state.ts` | implementation-source | active | Owns `ProjectContinuation` normalization and validation. |
| `src/task/task-finish.ts` | implementation-source | active | Owns close-time handoff parsing and current-state write planning. |
| `src/task/task-capsule.ts` | implementation-source | active | Owns new capsule scaffold templates. |

## Changes

| Area | Summary |
|---|---|
| Current-state continuation | Added structured disposition/create-task inputs to handoff continuation promotion. |
| Task close | Reads structured `HANDOFF.md` `Next Recommended Step` tables first, with legacy three-column fallback. |
| Task templates | New capsules scaffold the structured five-column continuation table. |
| Workflow docs | Documented the structured continuation contract and allowed dispositions. |
| Tests | Added structured continuation coverage and preserved terminal phrase/legacy behavior. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Dashboard/TUI display paths still render the handoff section as Markdown; no semantic change was needed for this capsule. | Open | Future UI/read-model cleanup only if consumers need structured fields directly. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-21 | Draft | Initial task scaffold. |
| 2026-07-21 | In Progress | Implemented structured handoff continuation parsing, template update, workflow docs, focused tests, build, docs doctor, and Docker sync-build. |
| 2026-07-21 | Done | Validation evidence recorded and close-source docs prepared. |
