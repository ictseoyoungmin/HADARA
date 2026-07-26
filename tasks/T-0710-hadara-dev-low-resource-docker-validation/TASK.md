# T-0710 HADARA-dev Low-resource Docker Validation

## Identity

| Field | Value |
|---|---|
| ID | T-0710 |
| Title | HADARA-dev Low-resource Docker Validation |
| Status | Done |
| Created | 2026-07-26T21:32 |
| Updated | 2026-07-26T21:45 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Provide official serial and low-resource Docker validation modes for HADARA-dev. | Keep all behavior in repo-local tools/scripts and reuse the existing Docker workflow. |

## Scope

| Boundary | Items |
|---|---|
| In | `tools/dev-docker-check.ts`, tools-only argument routing/help, reusable Docker script, HADARA-dev tests, and validation docs. |
| Out | Shipped `src/` behavior, public HADARA CLI options, container lifecycle changes, and failure classification. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define serial and low-resource semantics on the existing Docker paths. | Done |
| 2 | Add tools/script flags, report projection, help, tests, and docs without touching `src/`. | Done |
| 3 | Run focused/full/Docker validation, record evidence, close, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `--serial` runs public and HADARA-dev Vitest suites with one worker and file parallelism disabled. | Met | `ev:T-0710:3d2456b28f1044fba908c4fd`, `ev:T-0710:81ab9e87ca3c4f9391300f67` | User instruction |
| AC-2 | `--low-resource` implies serial mode, caps Node heap at 1024 MiB, and limits npm jobs to one. | Met | `ev:T-0710:81ab9e87ca3c4f9391300f67` | Constrained-host workflow |
| AC-3 | Options are discoverable in repo-local help/docs and no `src/` file changes. | Met | `ev:T-0710:6dc32fbb76e9416999acdf44`, `ev:T-0710:5386a019fa8a4dedb00f0b27` | Architecture boundary |
| AC-4 | Focused/full tests plus a real Docker low-resource smoke pass. | Met | `ev:T-0710:3d2456b28f1044fba908c4fd`, `ev:T-0710:81ab9e87ca3c4f9391300f67` | `docs/TEST_STRATEGY.md` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused tools and script regressions | Yes | Passed | Tools typecheck, public help 3 tests, and HADARA-dev Docker wrapper/script 11 tests passed. | ev:T-0710:3d2456b28f1044fba908c4fd |
| Full repository validation | Yes | Passed | Home-mounted low-resource Docker check passed 142 public files/1107 tests and 16 HADARA-dev files/131 tests. | ev:T-0710:81ab9e87ca3c4f9391300f67 |
| Real Docker low-resource smoke | Yes | Passed | Full check ran with maxWorkers=1, file parallelism disabled, 1024 MiB Node heap, and npmJobs=1; initial environment setup blocker was resolved. | ev:T-0710:81ab9e87ca3c4f9391300f67 |
| Diff, scope, and evidence hygiene | Yes | Passed | No src diff; bash syntax, git diff --check, and evidence lint passed with zero issues. | ev:T-0710:5386a019fa8a4dedb00f0b27 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Current user instruction | decision | active | Low-resource mode is HADARA-dev-only and must not enter `src/`. |
| `docs/TEST_STRATEGY.md` | constraint | active | Docker is the documented primary fallback validation path. |
| `tools/dev-docker-check.ts` | implementation | active | Reuse its temp-copy, redaction, and guarded dist-sync behavior. |

## Changes

| Area | Summary |
|---|---|
| Repo-local Docker wrapper | Added serial/low-resource option plumbing and resource projection. |
| Reusable script | Added matching flags for the npm Docker helper. |
| Tests/docs | Added option behavior, help, shell syntax, and operator guidance coverage. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Failure classification remains the next independent capsule. | Open | User instruction |

## Close Summary

HADARA-dev Docker validation now supports official serial and low-resource modes outside `src/`.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-26 | Draft | Initial task scaffold. |
| 2026-07-26 | In Progress | Implemented repo-local resource options without changing `src/`. |
| 2026-07-26 | Done | Focused, full, real Docker, scope, and evidence validation passed. |
