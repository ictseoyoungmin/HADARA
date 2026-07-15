# T-0619 0.4.6 docker sync build fast path and progress diagnostics

## Identity

| Field | Value |
|---|---|
| ID | T-0619 |
| Title | 0.4.6 docker sync build fast path and progress diagnostics |
| Status | Done |
| Created | 2026-07-15 |
| Updated | 2026-07-15 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make HADARA-dev Docker dist refresh fast and observable before 0.4.6-rc.1. | `dev:docker-sync-build` should refresh `dist` without copying multi-GB docs/tasks artifacts or running the full suite; `dev:docker-check` remains the full validation path. |

## Scope

| Boundary | Items |
|---|---|
| In | `scripts/dev-docker-sync-build.sh`, package-script semantics, progress diagnostics, focused tests, Docker fast-path smoke, workflow docs. |
| Out | Rewriting `src/dev/docker-check.ts`, changing release helpers, removing full-check coverage, optimizing all mounted `dist` copy overhead. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Split helper intent into fast sync-build and full check behavior. | Done |
| 2 | Add stage progress and duration output. | Done |
| 3 | Keep full check copy broad enough for archive/history/task-artifact tests. | Done |
| 4 | Validate focused script behavior and real Docker fast path. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `dev:docker-sync-build` copies only the minimal build workspace, runs `npm ci`, `npm run build`, syncs `dist`, and runs the built CLI smoke. | Done | `ev:T-0619:f8f71a4c21ac4bb889bd2185` | `scripts/dev-docker-sync-build.sh` |
| AC-2 | `dev:docker-check` remains the full check path and does not use the minimal build workspace. | Done | `ev:T-0619:16c1b0ca801940cd9d22d185` | `scripts/dev-docker-sync-build.sh`, `tests/unit/dev-docker-script.test.ts` |
| AC-3 | The helper prints visible stage start/done lines with durations. | Done | `ev:T-0619:f8f71a4c21ac4bb889bd2185` | `scripts/dev-docker-sync-build.sh` |
| AC-4 | Workflow docs describe the new split clearly. | Done | `ev:T-0619:16c1b0ca801940cd9d22d185` | `docs/HADARA_WORKFLOW.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Shell syntax, focused script test, TypeScript build | Yes | Passed | `ev:T-0619:16c1b0ca801940cd9d22d185` |
| Real Docker fast sync-build | Yes | Passed | `ev:T-0619:f8f71a4c21ac4bb889bd2185` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `scripts/dev-docker-sync-build.sh` | implementation-source | active | Existing helper copied too much and ran full check for every dist refresh. |
| `docs/HADARA_WORKFLOW.md` | implementation-source | active | HADARA-dev operator docs need to distinguish fast sync from full validation. |
| T-0618 residual | reference | active | Docker sync-build hung without output before stage progress and fast-path split. |

## Changes

| Area | Summary |
|---|---|
| Docker helper | Added `log_step`/`run_step`, minimal build copy for sync-build, full workspace copy for check-only, and separate `npm run build` vs `npm run check` execution. |
| Workflow docs | Documented `dev:docker-sync-build` as fast dist refresh and `dev:docker-check` as full validation. |
| Tests | Updated shell helper tests for the split and EPERM-tolerant syntax validation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full `dev:docker-check` still copies the full repo and took 89s just for copy in this mounted workspace; this is expected for full validation because archive/history/artifact tests need those files. | Open | `scripts/dev-docker-sync-build.sh` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-15 | Draft | Initial task scaffold. |
| 2026-07-15 | In Progress | Implemented Docker fast sync-build path, progress diagnostics, focused validation, and real Docker fast-path smoke. |
| 2026-07-15 | Done | Closed after focused script/build validation and real Docker fast sync-build smoke. |
