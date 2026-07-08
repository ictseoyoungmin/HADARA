# T-0527 speed up task status with invocation snapshot

## Identity

| Field | Value |
|---|---|
| ID | T-0527 |
| Title | speed up task status with invocation snapshot |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Speed up selected-task `task status` by sharing read results within one invocation. | Use in-memory invocation-local memoization only; do not persist short-lived status cache under `.hadara/local/cache`. |

## Scope

| Boundary | Items |
|---|---|
| In | Read-only invocation-local fs memoization for `task status` read models, focused tests, mounted-workspace timing smoke, Docker dist refresh. |
| Out | Persistent cache invalidation, write-flow snapshot reuse, worker-thread/child-process parallel diagnostics, broad protocol-doctor redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Add read-only invocation-local memoization to task status paths. | Done |
| 3 | Validate focused behavior and mounted-workspace timing. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task status --task <id> --detail full` reuses repeated sync file reads within one read-only invocation and does not persist cache files. | Done | `ev:T-0527:9ac796c7294d4a0e93fe1437` | User request. |
| AC-2 | The memo layer is discarded after each invocation and observes file changes on the next command. | Done | `ev:T-0527:9ac796c7294d4a0e93fe1437` | `tests/unit/invocation-fs-memo.test.ts` |
| AC-3 | Mounted-workspace selected-task full status smoke completes under 3 seconds after the change. | Done | `ev:T-0527:95f839350b804768846e724e` | T-0526 local feedback. |
| AC-4 | Docker build/test refreshes workspace `dist` before final built-CLI validation. | Done | `ev:T-0527:7786e0e4e1a04aa1ab6840e5` | `AGENTS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests | Yes | Passed | `ev:T-0527:9ac796c7294d4a0e93fe1437` |
| TypeScript build | Yes | Passed | `ev:T-0527:9ac796c7294d4a0e93fe1437` |
| Mounted built status timing smoke | Yes | Passed | `ev:T-0527:95f839350b804768846e724e` |
| Docker sync build and built status smoke | Yes | Passed | `ev:T-0527:7786e0e4e1a04aa1ab6840e5` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | reference | active | Apply invocation-local memoization and evaluate parallelization/cache storage. |
| `.hadara/context/HADARA_CONTEXT.md` | constraint | active | Preserve project/local cache boundary. |
| `AGENTS.md` | constraint | active | Use Docker sync build for CLI source changes. |

## Changes

| Area | Summary |
|---|---|
| Task status | Added read-only invocation-local fs memoization around selected-task and selection task status report creation. |
| Performance | Local mounted full-status smoke for T-0527 dropped from about 10.1s before the patch to 2.55s after the patch. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | True parallelization needs an async read-model redesign; current downstream readers are synchronous, so fake `Promise.all` would not help. | Open | `.hadara/local/feedback/T-0527-parallelization-boundary.md` |
| RF-2 | Risk | Do not wrap write/finalize mutation boundaries with invocation memoization; write paths must re-read fresh state before hashing/appending evidence. | Closed | `src/core/invocation-fs-memo.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | Done | Added invocation-local fs memoization and validated selected-task full status under 3s on mounted and Docker-built smokes. |
