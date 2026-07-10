# T-0567 Structured next work current-state contract

## Identity

| Field | Value |
|---|---|
| ID | T-0567 |
| Title | Structured next work current-state contract |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Split continuation title from operator guidance in structured current state. | `nextOperatorIntent` remains compatibility-only; `nextWork.title` becomes the task-selection title source. |

## Scope

| Boundary | Items |
|---|---|
| In | `.hadara/state/current.json` schema/type/projections, `task status` selection, `session start`, operations status, tests, and dist refresh. |
| Out | Removing `nextOperatorIntent`, adding a new state editing CLI, or changing release publication flow. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Add `nextWork` and route task selection through its title. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current-state canon supports `nextWork` with title, state, operator guidance, and create-command permission. | Met | `ev:T-0567:1b919ecbb3cd45b09ed451cb` | `src/services/project-current-state.ts` |
| AC-2 | `task status --json` recommendations use `nextWork.title`, never free-form `nextOperatorIntent`, and suppress create commands when `createCommandAllowed:false`. | Met | `ev:T-0567:1b919ecbb3cd45b09ed451cb` | `src/task/task-selection.ts` |
| AC-3 | `session start --json` exposes structured `nextWork` while retaining compatibility `nextOperatorIntent`. | Met | `ev:T-0567:1b919ecbb3cd45b09ed451cb` | `src/context/session-start.ts` |
| AC-4 | Validation evidence is recorded. | Met | `ev:T-0567:1b919ecbb3cd45b09ed451cb` | T-0567 evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| TypeScript no emit | Yes | Passed | `ev:T-0567:1b919ecbb3cd45b09ed451cb` |
| Focused unit tests | Yes | Passed | `ev:T-0567:1b919ecbb3cd45b09ed451cb` |
| Docker sync build / dist refresh | Yes | Passed | `ev:T-0567:1b919ecbb3cd45b09ed451cb` |
| Built CLI smokes | Yes | Passed | `ev:T-0567:1b919ecbb3cd45b09ed451cb` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/state/current.json` | implementation-source | active | Structured current-state canon. |
| `src/task/task-selection.ts` | implementation-source | active | Selection cockpit read model. |
| User UX decision | constraint | active | Operator prose must not become a task title. |

## Changes

| Area | Summary |
|---|---|
| Current state | Added structured `nextWork` contract and projections. |
| Task selection | Routes current-state recommendations through `nextWork.title`; guidance remains non-title metadata. |
| Session start/status | Exposes/uses structured next work without dropping compatibility field. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Remove deprecated `nextOperatorIntent` only after at least one compatibility release. | Deferred | Compatibility review after one release. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Implemented structured next-work current-state contract. |
| 2026-07-10 | Done | Validated structured next-work routing and refreshed dist. |
