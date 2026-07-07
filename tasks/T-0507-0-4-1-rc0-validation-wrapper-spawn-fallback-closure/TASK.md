# T-0507 0.4.1 rc0 validation wrapper spawn fallback closure

## Identity

| Field | Value |
|---|---|
| ID | T-0507 |
| Title | 0.4.1 rc0 validation wrapper spawn fallback closure |
| Status | Done |
| Created | 2026-07-07 |
| Updated | 2026-07-07 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Close the remaining T-0505 F-5 validation-wrapper friction by making `validation run` able to record an already-run direct result without spawning a child process. | Preserve normal execute-and-record behavior, but give agents one validation-surface command for EPERM/EACCES wrapper launch environments so they do not have to fall back to unrelated evidence commands. |

## Scope

| Boundary | Items |
|---|---|
| In | `validation run --direct-result passed / failed / blocked`, direct-result evidence semantics, TASK.md Validation row sync, generated/current workflow docs, registry help, tests, and fresh dogfood focused on T-0505 F-5. |
| Out | General child-process sandbox policy changes, shell emulation, package manager behavior, npm publish/release smoke. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the direct-result fallback contract for validation wrapper launch failures. | Done |
| 2 | Implement service/CLI/docs/tests for `validation run --direct-result`. | Done |
| 3 | Rerun focused tests and fresh toy dogfood proving F-5 is closed. | Done |
| 4 | Update shared state before finalize and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `validation run --direct-result passed / failed / blocked` records validation evidence without spawning a child process and preserves validation-check resolution behavior. | Met | `ev:T-0507:9539808a63394c0095f185cd` | T-0505 F-5 |
| AC-2 | `--direct-result` can update a matching TASK.md Validation row, including the same row-sync path used by normal `validation run --update-task`. | Met | `ev:T-0507:3357d27e0c5c4b93bf30f3ea` | T-0505 F-4/F-5 |
| AC-3 | Generated/current workflow docs and registry help route wrapper launch failures to `validation run --direct-result`, not only to unrelated `evidence add-command`. | Met | `ev:T-0507:9539808a63394c0095f185cd` | T-0505 F-5 |
| AC-4 | Fresh `/tmp` dogfood proves the T-0505 F-5 path: simulate or reproduce wrapper blocked state, run the command directly, record the direct result through `validation run --direct-result`, and close the toy task. | Met | `ev:T-0507:3357d27e0c5c4b93bf30f3ea` | T-0505 DOGFOOD_REPORT |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused validation-run tests | Yes | Passed | `ev:T-0507:9539808a63394c0095f185cd` |
| TypeScript build | Yes | Passed | `ev:T-0507:c450d2efdc934318815a3389` |
| Fresh `/tmp` dogfood | Yes | Passed | `ev:T-0507:3357d27e0c5c4b93bf30f3ea` |
| Full Docker validation | Yes | Passed | `ev:T-0507:c450d2efdc934318815a3389` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0505-0-4-1-rc0-fresh-toy-project-dogfood-review/DOGFOOD_REPORT.md` | reference | implemented | F-5 requires wrapper spawn friction to be closed, not merely noted. |
| `tasks/T-0506-0-4-1-rc0-dogfood-follow-up-command-surface-cleanup/DOGFOOD_REPORT.md` | reference | implemented | Shows F-5 remained mitigated with RF-1 open after T-0506. |
| `src/services/validation-run.ts` | reference | implemented | Current execute-and-record service and row sync path. |

## Changes

| Area | Summary |
|---|---|
| CLI | Add direct-result mode to `validation run` without changing normal execution semantics. |
| Docs | Route wrapper launch fallback through `validation run --direct-result`. |
| Tests | Cover no-spawn direct result, auto-resolution, row sync, and CLI routing. |
| Dogfood | Fresh governed `/tmp` toy project used direct command execution plus `validation run --direct-result`, then closed `closed-valid`. |
| Dashboard tests | Added explicit timeout to a broad dashboard bootstrap read-model test that otherwise timed out under full-suite contention. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | General Node child_process EPERM in this tool environment may still exist for other commands; this capsule closes validation workflow recovery, not host policy. | Closed | T-0505 F-5 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-07 | Draft | Initial task scaffold. |
| 2026-07-07 | In Progress | Implementing direct-result validation fallback after T-0506 left F-5 only mitigated. |
| 2026-07-07 | Done | Direct-result validation fallback, fresh dogfood, and full Docker validation passed. |
