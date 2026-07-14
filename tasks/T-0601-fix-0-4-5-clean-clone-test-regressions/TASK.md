# T-0601 Fix 0.4.5 clean-clone test regressions

## Identity

| Field | Value |
|---|---|
| ID | T-0601 |
| Title | Fix 0.4.5 clean-clone test regressions |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Fix the clean-clone unit regressions reported after T-0600. | Preserve brownfield zero-write adoption while keeping empty scaffold parent directories greenfield-safe. |

## Scope

| Boundary | Items |
|---|---|
| In | `init` greenfield/brownfield classification, brownfield package metadata propagation, and affected unit tests. |
| Out | npm/GitHub publication and broader release readiness recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reproduce and classify the four reported clean-clone failures. | Done |
| 2 | Fix empty `docs/`/`tasks/` greenfield classification and brownfield package purpose propagation. | Done |
| 3 | Validate in Docker and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Empty scaffold parent directories do not force `hadara init` into brownfield adoption. | Done | `tests/unit/session-start.test.ts`; `tests/unit/task-finish.test.ts` | `src/init/adoption.ts` |
| AC-2 | Existing `package.json` projects still use explicit brownfield adoption, and package description is propagated to generated product metadata when adopted. | Done | `tests/unit/docs-doctor.test.ts` | `src/init/adoption.ts` |
| AC-3 | The reported clean-clone failing test files pass. | Done | `EVIDENCE.md` | `tests/unit/docs-doctor.test.ts`; `tests/unit/session-start.test.ts`; `tests/unit/task-finish.test.ts` |
| AC-4 | Full Docker validation passes before returning to publish flow. | Done | `EVIDENCE.md` | `docs/HADARA_WORKFLOW.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| TypeScript build | Yes | Passed | ev:T-0601:5b2a2ce79b1e4da992bee548 |
| Focused clean-clone regression tests | Yes | Passed | ev:T-0601:fed96a7bc69f41c4bc76f889 |
| Docker build | Yes | Passed | ev:T-0601:d294bf75d06e47e89ed0fdfb |
| Docker full test suite | Yes | Passed | ev:T-0601:8907aba9189441969d45d6c5 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User-provided failed test output | constraint | active | Four failures after T-0600 in docs doctor, session start, and task finish. |
| `docs/HADARA_WORKFLOW.md` | constraint | active | HADARA-dev validation should use Docker when host Node/npm/spawn is unreliable. |

## Changes

| Area | Summary |
|---|---|
| `src/init/adoption.ts` | Treat empty `docs/`/`tasks/` directories as greenfield-safe, while keeping manifests/source/docs/task contents as brownfield signals. Propagate `package.json` description into adopted Project State metadata. |
| `src/init/types.ts` | Add optional brownfield project purpose metadata. |
| `tests/unit/docs-doctor.test.ts` | Update package metadata inference coverage to use explicit brownfield adoption. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Host full suite can false-fail under tool-host `spawnSync ... EPERM`; Docker full suite is the release-relevant validation path. | Closed | `.hadara/local/feedback/T-0601-host-full-suite-spawn-eperm.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Fixed clean-clone init classification and brownfield metadata regressions. |
| 2026-07-14 | Done | Focused regressions and Docker full suite passed. |
