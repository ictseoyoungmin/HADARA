# T-0709 Compact Task Identity Targets

## Identity

| Field | Value |
|---|---|
| ID | T-0709 |
| Title | Compact Task Identity Targets |
| Status | Done |
| Created | 2026-07-26T21:16 |
| Updated | 2026-07-26T21:24 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove redundant default project targeting from TASK.md Identity without losing explicit target information. | Default targets remain canonical in Task Board; only non-project explicit targets remain visible in TASK.md. |

## Scope

| Boundary | Items |
|---|---|
| In | Default TASK.md scaffold identity rendering; explicit target preservation; focused/full/built CLI tests. |
| Out | Task Board Targets column, TargetRef persistence, existing historical Capsule rewrites, and shared projection behavior. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm Task Board owns canonical default targets and TASK.md readers tolerate omission. | Done |
| 2 | Omit only the default project row while retaining explicit non-project targets. | Done |
| 3 | Validate, record evidence, close, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Default task creation omits the Targets project row from TASK.md Identity. | Met | `ev:T-0709:78c83f82307f4805b366a55a` | User instruction |
| AC-2 | Explicit non-project targets still appear in TASK.md and all targets remain in Task Board. | Met | `ev:T-0709:8212f3b04ec04c92b966b035`, `ev:T-0709:78c83f82307f4805b366a55a` | Init v1 TargetRef contract |
| AC-3 | Focused/full tests and built CLI smoke pass. | Met | `ev:T-0709:800044057fa34400a2cc2ba5`, `ev:T-0709:7c5771d1f6f0406f8a8f75fe` | `docs/TEST_STRATEGY.md` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused target rendering regressions | Yes | Passed | Task Board and Task Capsule focused suites passed 5 tests with default omission and explicit-target preservation. | ev:T-0709:8212f3b04ec04c92b966b035 |
| Full repository validation | Yes | Passed | With T-0708 in-progress implementation isolated, npm run check passed 142 public files/1104 tests and 16 HADARA-dev files/129 tests. | ev:T-0709:800044057fa34400a2cc2ba5 |
| Built CLI task-create smoke | Yes | Passed | Fresh Init created a default task without a TASK.md Targets row, retained component:cli for an explicit task, and kept both values in Task Board. | ev:T-0709:78c83f82307f4805b366a55a |
| Diff and evidence hygiene | Yes | Passed | git diff --check and evidence lint passed with zero issues. | ev:T-0709:7c5771d1f6f0406f8a8f75fe |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Current user instruction | decision | active | Remove redundant Targets project display from TASK.md Identity. |
| `docs/ARCHITECTURE.md` | constraint | active | Preserve Init v1 TargetRef and Task Board ownership. |
| `docs/TEST_STRATEGY.md` | constraint | active | Validate both default and explicit target creation. |

## Changes

| Area | Summary |
|---|---|
| TASK.md scaffold | Default project target row is omitted; explicit targets remain rendered. |
| Ownership | Task Board continues to persist every target, including the default project target. |
| Tests | Added default-omission coverage and verified explicit targets through built CLI. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | T-0708 registered shared close projection remains the next queued capsule. | Open | `tasks/T-0708-registered-shared-close-projection/TASK.md` |

## Close Summary

Default project targets no longer clutter TASK.md Identity; explicit targets remain visible.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-26 | Draft | Initial task scaffold. |
| 2026-07-26 | In Progress | Implemented conditional target identity rendering. |
| 2026-07-26 | Done | Focused, full, built CLI, diff, and evidence validation passed. |
