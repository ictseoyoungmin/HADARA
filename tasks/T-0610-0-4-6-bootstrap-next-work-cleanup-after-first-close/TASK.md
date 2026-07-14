# T-0610 0.4.6 bootstrap next-work cleanup after first close

## Identity

| Field | Value |
|---|---|
| ID | T-0610 |
| Title | 0.4.6 bootstrap next-work cleanup after first close |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make brownfield adoption-baseline next-work less misleading after a project already has task history. | Preserve the structured nextWork value, but stop emitting an automatic task-create command when existing tasks indicate the operator should review first. |

## Scope

| Boundary | Items |
|---|---|
| In | Task-selection recommendation logic, focused tests, build/full-suite validation, and capsule evidence. |
| Out | Mutating `.hadara/state/current.json` automatically, deleting adoption-baseline guidance, or changing init adoption defaults. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Downgrade adoption-baseline nextWork to review-only when task history exists. | Done |
| 3 | Validate focused tests, build, Docker full suite, and dist freshness. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Brownfield adoption baseline still appears as guidance but no longer emits a `hadara task create ...` command after task history exists. | Done | `ev:T-0610:56f7f639d01d4ba687250d92` | `tests/unit/task-selection.test.ts` |
| AC-2 | First-task bootstrap suppression behavior remains intact. | Done | `ev:T-0610:56f7f639d01d4ba687250d92` | `src/task/task-selection.ts` |
| AC-3 | Full Docker validation and dist refresh pass. | Done | `ev:T-0610:56f7f639d01d4ba687250d92` | `npm run dev:docker-sync-build` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused task-selection tests | Yes | Passed | `ev:T-0610:56f7f639d01d4ba687250d92` |
| TypeScript build | Yes | Passed | `ev:T-0610:56f7f639d01d4ba687250d92` |
| Docker dev sync build and full suite | Yes | Passed | `ev:T-0610:56f7f639d01d4ba687250d92` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0607-0-4-6-codex-delegated-onboarding-dogfood/DOGFOOD_REPORT.md` | reference | active | Delegated Codex reported adoption-baseline nextWork reading stale after a successful first feature capsule. |
| `src/task/task-selection.ts` | implementation-source | active | Selection report owns create-command emission and review-only next action behavior. |

## Changes

| Area | Summary |
|---|---|
| `src/task/task-selection.ts` | Added adoption-baseline review-only downgrade when existing task history is present. |
| `tests/unit/task-selection.test.ts` | Added regression coverage for adoption-baseline review-only behavior. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Structured state may still contain the adoption-baseline nextWork until an operator intentionally updates current state; this patch only prevents an automatic create command after history exists. | Open | `src/task/task-selection.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Implemented review-only task-selection behavior for stale-looking adoption baseline guidance. |
| 2026-07-14 | Done | Validated focused tests, build, Docker full suite, and dist freshness. |
