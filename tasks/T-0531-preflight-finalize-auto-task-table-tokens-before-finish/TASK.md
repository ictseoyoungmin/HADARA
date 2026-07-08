# T-0531 preflight finalize auto task table tokens before finish

## Identity

| Field | Value |
|---|---|
| ID | T-0531 |
| Title | preflight finalize auto task table tokens before finish |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| `task finalize --execute --auto` refuses before any finish write when done-level TASK.md/table blockers are already detectable. | Prevent partial Done writes followed by token/plan blockers, as reported in local feedback T-0530. |

## Scope

| Boundary | Items |
|---|---|
| In | Auto-finalize preflight for non-finish-resolvable done-level blockers; regression coverage for zero-write refusal; focused validation and dist refresh. |
| Out | Broad lifecycle rewrite, manual `--plan-hash` behavior changes, task finish semantics changes, controlled-vocabulary expansion. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract from local feedback. | Done |
| 2 | Add auto-finalize preflight and regression tests. | Done |
| 3 | Validate, refresh dist, record evidence, and finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Auto finalize returns a read-only blocked report with zero file writes when finish is required but TASK.md table/plan blockers are present. | Met | `ev:T-0531:a8b776840d10489194038558` | `.hadara/local/feedback/T-0530-finalize-partial-finish-token-friction.md` |
| AC-2 | Clean auto-finalize still closes a valid capsule through finish, readiness evidence, close, and audit. | Met | `ev:T-0531:a8b776840d10489194038558` | `tests/unit/task-finalize.test.ts` |
| AC-3 | Focused tests and Docker dist refresh pass. | Met | `ev:T-0531:6e504ac328ae492d92a2d874` | `docs/HADARA_WORKFLOW.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run test:focused -- tests/unit/task-finalize.test.ts tests/unit/removed-lifecycle.test.ts` | Yes | Passed | `ev:T-0531:a8b776840d10489194038558` |
| `npm run build` | Yes | Passed | `ev:T-0531:155195d5cd3d48128966d6e5` |
| `npm run dev:docker-sync-build -- --smoke-command "task status --task T-0531 --summary-json"` | Yes | Passed | `ev:T-0531:6e504ac328ae492d92a2d874` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/local/feedback/T-0530-finalize-partial-finish-token-friction.md` | reference | active | Local-only UX report; do not commit. |
| `src/task/task-finalize.ts` | implementation-source | active | Auto-finalize orchestration. |
| `tests/unit/task-finalize.test.ts` | reference | active | Regression coverage for FD-010 finalize auto. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Lifecycle command contract. |

## Changes

| Area | Summary |
|---|---|
| Finalize auto | Added an auto-only done-level preflight that blocks on non-finish-resolvable close-plan errors before any finish write. |
| Tests | Added zero-write preflight blocker regression coverage and updated removed-lifecycle recovery expectations to the safer no-partial-write behavior. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Consider scaffold-level token examples if users still hit role/status token friction. | Open | `.hadara/local/feedback/T-0530-finalize-partial-finish-token-friction.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Implemented auto-finalize preflight and regression coverage. |
| 2026-07-08 | Done | Focused tests, TypeScript build, and Docker sync-build passed. |
