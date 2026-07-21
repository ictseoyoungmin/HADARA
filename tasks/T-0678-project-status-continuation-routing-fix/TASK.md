# T-0678 Project Status Continuation Routing Fix

## Identity

| Field | Value |
|---|---|
| ID | T-0678 |
| Title | Project Status Continuation Routing Fix |
| Status | Done |
| Created | 2026-07-21T23:43 |
| Updated | 2026-07-21T23:48 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0678 --json`.

## Goal

| Goal | Notes |
|---|---|
| Make top-level `hadara status --json` surface actionable current-state continuations instead of falling through to idle. | T-0677 closed with an actionable rc.2 continuation in `.hadara/state/current.json`, but project status still reported idle/source none. That hides the next task from agents. |

## Scope

| Boundary | Items |
|---|---|
| In | Project status v2 phase/action routing for current-state `continuation`, schema enum alignment, CLI contract wording, focused regression tests, Docker sync-build, docs doctor, and close evidence. |
| Out | Changing task-selection status v2, creating the rc.2 implementation capsule, implementing Phase D, changing continuation storage schema, or republishing packages. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract from the T-0677 post-close dogfood finding. | Done |
| 2 | Add project status continuation-ready phase and next action. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara.status.v2` reports `phase=continuation-ready` and `create-continuation-task` when no higher-priority work exists and current-state continuation is actionable. | Met | ev:T-0678:ec36c75ccc504537b635db44 | `src/services/project-status-v2.ts` |
| AC-2 | `hadara.project.status.v2` schema accepts the new `continuation-ready` phase. | Met | ev:T-0678:ec36c75ccc504537b635db44 | `src/schemas/project-status.schema.json` |
| AC-3 | Focused tests cover the HADARA-dev reproduction class: Done task history, no active task/nextWork, actionable continuation, no other recommendation. | Met | ev:T-0678:ec36c75ccc504537b635db44 | `tests/unit/status-json.test.ts` |
| AC-4 | CLI contract documents project status continuation routing. | Met | ev:T-0678:ec36c75ccc504537b635db44 | `docs/CLI_JSON_CONTRACT.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- --run tests/unit/status-json.test.ts tests/unit/status-continuation.test.ts tests/unit/task-selection-continuation.test.ts tests/unit/schema-runtime.test.ts` | Yes | Passed | ev:T-0678:ec36c75ccc504537b635db44 |
| `npm run build` | Yes | Passed | ev:T-0678:ec36c75ccc504537b635db44 |
| `npm run dev:docker-sync-build` | Yes | Passed | ev:T-0678:ec36c75ccc504537b635db44 |
| `node dist/cli/main.js status --json` | Yes | Passed | ev:T-0678:ec36c75ccc504537b635db44 |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | ev:T-0678:ec36c75ccc504537b635db44 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0677 post-close dogfood | reference | active | `.hadara/state/current.json` had actionable continuation, but project status reported idle. |
| `src/services/task-selection-status-v2.ts` | reference | active | Existing task-selection status continuation routing behavior to mirror at project ingress. |
| `src/services/project-status-v2.ts` | implementation-source | active | Top-level project/session ingress route needing the fix. |

## Changes

| Area | Summary |
|---|---|
| Project status v2 | Added `continuation-ready` phase and primary next action generation for actionable/waiting current-state continuation. |
| Schema | Added `continuation-ready` to `hadara.project.status.v2` phase enum. |
| Tests | Added regression for actionable continuation with completed task history and no higher-priority recommendation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | If project status and task-selection status continue to share routing concepts, extract continuation-next-action generation to a shared helper in a later cleanup. | Open | `src/services/project-status-v2.ts`; `src/services/task-selection-status-v2.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-21 | Draft | Initial task scaffold. |
| 2026-07-21 | In Progress | Added project status continuation routing and focused regression test. |
| 2026-07-21 | Done | Validated project status continuation routing and prepared capsule for close. |
