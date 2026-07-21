# T-0675 Current-State Baseline Promotion Surface

## Identity

| Field | Value |
|---|---|
| ID | T-0675 |
| Title | Current-State Baseline Promotion Surface |
| Status | Done |
| Created | 2026-07-21T22:46 |
| Updated | 2026-07-21T22:51 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0675 --json`.

## Goal

| Goal | Notes |
|---|---|
| Add a bounded current-state validation baseline promotion surface. | Operators should be able to promote a reviewed evidence set into `.hadara/state/current.json` and its managed `PROJECT_STATE`/`AGENT_HANDOFF` projections without hand-editing managed blocks. |

## Scope

| Boundary | Items |
|---|---|
| In | Dry-run-first `status baseline promote` CLI surface, current-state service planning/apply API, registry docs, workflow docs, focused tests, Docker sync-build, and promoting the T-0675 validation baseline. |
| Out | Automatic baseline selection, evidence quality scoring, broad dashboard/TUI redesign, changing evidence append semantics, or mutating non-managed prose sections. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement dry-run-first baseline promotion surface. | Done |
| 3 | Validate and record evidence. | Done |
| 4 | Promote the T-0675 validation baseline and check drift. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara status baseline promote --summary ... --evidence ... --json` reports a dry-run plan without writes. | Met | ev:T-0675:19d5561063dd413d8bc6418e | `src/cli/status.ts` |
| AC-2 | `--execute` applies only the managed current-state bundle: `.hadara/state/current.json`, `docs/PROJECT_STATE.md`, and `docs/AGENT_HANDOFF.md`. | Met | ev:T-0675:3c4042b677f64497bbe6ddbb | `src/services/project-current-state.ts` |
| AC-3 | `status --json` exposes the promoted validation baseline. | Met | ev:T-0675:19d5561063dd413d8bc6418e | `src/services/project-status-v2.ts` |
| AC-4 | Docs explain when and how to promote a reviewed validation baseline without hand-editing managed blocks. | Met | ev:T-0675:19d5561063dd413d8bc6418e | `docs/HADARA_WORKFLOW.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |
| AC-5 | Validation evidence is recorded and the T-0675 validation set is promoted. | Met | ev:T-0675:19d5561063dd413d8bc6418e, ev:T-0675:3c4042b677f64497bbe6ddbb | `EVIDENCE.md`, `.hadara/state/current.json` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- --run tests/unit/project-current-state.test.ts tests/unit/status-json.test.ts tests/unit/schema-runtime.test.ts` | Yes | Passed | ev:T-0675:19d5561063dd413d8bc6418e |
| `npm run build` | Yes | Passed | ev:T-0675:19d5561063dd413d8bc6418e |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | ev:T-0675:19d5561063dd413d8bc6418e |
| `npm run dev:docker-sync-build` | Yes | Passed | ev:T-0675:19d5561063dd413d8bc6418e |
| `node dist/cli/main.js status baseline promote --summary ... --evidence ev:T-0675:dryrun --json` | Yes | Passed | ev:T-0675:19d5561063dd413d8bc6418e |
| `node dist/cli/main.js status baseline promote --summary ... --evidence ev:T-0675:... --execute --json` | Yes | Passed | ev:T-0675:3c4042b677f64497bbe6ddbb |
| `node dist/cli/main.js status --json` | Yes | Passed | ev:T-0675:19d5561063dd413d8bc6418e |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer release recycle plan | reference | active | Requires current-state baseline promotion to avoid stale baseline drift. |
| `.hadara/state/current.json` | implementation-source | active | Owns structured validation baseline. |
| `src/services/project-current-state.ts` | implementation-source | active | Owns current-state read/write planning. |
| `src/cli/status.ts` | implementation-source | active | Owns status command routing and baseline promotion CLI. |
| `src/services/capability-registry.ts` | implementation-source | active | Owns command registry metadata. |
| `docs/HADARA_WORKFLOW.md` | implementation-source | active | Owns operator workflow guidance. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | implementation-source | active | Owns command semantics. |

## Changes

| Area | Summary |
|---|---|
| Current-state service | Added validation baseline promotion planning with summary/evidence validation and managed projection bundle writes. |
| CLI | Added `hadara status baseline promote` dry-run/execute surface. |
| Command registry | Registered the baseline promotion command and examples. |
| Docs | Documented validation baseline promotion workflow and command semantics. |
| Project state | Promoted the T-0675 validation evidence set as the current trusted validation baseline. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Automatic evidence selection remains out of scope; baseline promotion requires an explicit reviewed summary/evidence set. | Open | Future status/evidence UX only if needed. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-21 | Draft | Initial task scaffold. |
| 2026-07-21 | Done | Implemented and validated baseline promotion surface, promoted T-0675 validation baseline, and checked docs doctor/status outputs. |
