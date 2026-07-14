# T-0613 0.4.6 current-state validation baseline wording and task-id ordering polish

## Identity

| Field | Value |
|---|---|
| ID | T-0613 |
| Title | 0.4.6 current-state validation baseline wording and task-id ordering polish |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Future-proof current-state task id ordering and clarify validation baseline semantics before 0.4.6-rc.0. | Keep the changes narrow: numeric task id comparison plus projection/schema wording so agents do not assume `validationBaseline` must always be the latest task evidence. |

## Scope

| Boundary | Items |
|---|---|
| In | Current-state task id ordering helper, projection/schema wording for validation baseline, focused tests, build, Docker validation, and capsule evidence. |
| Out | Close timestamp chronology, release publication, changing validation baseline data shape, or broad current-state schema versioning. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Use numeric task-id ordering for current-state latest selection. | Done |
| 3 | Clarify validation baseline as the current trusted baseline. | Done |
| 4 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `highestTaskRef` compares task id numeric suffixes, so `T-10000` ranks after `T-9999`. | Done | `ev:T-0613:0d877653464a402ea8ad0daa` | `src/services/project-current-state.ts` |
| AC-2 | Current-state projections/schema describe `validationBaseline` as the current trusted validation baseline, not necessarily the latest task evidence. | Done | `ev:T-0613:0d877653464a402ea8ad0daa` | `src/services/project-current-state.ts` |
| AC-3 | Validation evidence is recorded. | Done | `ev:T-0613:0d877653464a402ea8ad0daa`, `ev:T-0613:1f07cdaa067c4cdca03424d3` | `tests/unit/project-current-state.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused project-current-state tests | Yes | Passed | `ev:T-0613:0d877653464a402ea8ad0daa` |
| TypeScript build | Yes | Passed | `ev:T-0613:0d877653464a402ea8ad0daa` |
| Docker dev sync build and full suite | Yes | Passed | `ev:T-0613:1f07cdaa067c4cdca03424d3` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User review | constraint | active | Remaining rc prep polish: numeric task-id ordering and validationBaseline meaning. |
| T-0612 | reference | active | Established highest-done-task-id write contract and current-state schema compatibility. |

## Changes

| Area | Summary |
|---|---|
| `src/services/project-current-state.ts` | Current-state task id ordering now parses numeric suffixes and projections label validation baseline as current trusted validation baseline. |
| `src/schemas/project-current-state.schema.json` | Task refs allow four-or-more digit ids and validation baseline description clarifies its trusted-baseline meaning. |
| `tests/unit/project-current-state.test.ts` | Added five-digit task id ordering coverage and projection wording coverage. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | If true close-time ordering becomes necessary, add a separate chronology field instead of overloading `latestCompletedTask`. | Open | Future current-state schema work |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Started task-id ordering and validation baseline wording polish. |
| 2026-07-14 | Done | Implemented polish and validated focused tests, build, Docker full suite, and dist freshness. |
