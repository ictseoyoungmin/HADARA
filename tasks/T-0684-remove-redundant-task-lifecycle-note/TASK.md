# T-0684 Remove Redundant Task Lifecycle Note

## Identity

| Field | Value |
|---|---|
| ID | T-0684 |
| Title | Remove Redundant Task Lifecycle Note |
| Status | Done |
| Created | 2026-07-22T21:15 |
| Updated | 2026-07-22T21:24 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove the redundant lifecycle note from newly generated TASK.md files. | The workflow docs already own close guidance; the capsule should begin with its task contract. |

## Scope

| Boundary | Items |
|---|---|
| In | Default and named-template TASK.md generators; generated and HADARA-dev AGENTS commit naming rule; focused scaffold regression tests. |
| Out | Historical completed capsules; lifecycle state-transition redesign; commit-history rewriting. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Trace the note and the T-0683 Draft history behavior. | Done |
| 2 | Remove the note from both TASK.md generators, preserve the commit convention, and update focused tests. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Default and named-template task creation omit the lifecycle note. | Met | `ev:T-0684:62f592d5f59c4eb18866cff4` | `src/task/task-capsule.ts`; `src/task/task-templates.ts` |
| AC-2 | Generated and project agent rules preserve the `T-XXXX Task Title` commit convention. | Met | `ev:T-0684:7326fe65955b4322b753e3ce` | `AGENTS.md`; `src/init/templates.ts` |
| AC-3 | Focused tests, build, and built CLI smoke pass. | Met | `ev:T-0684:62f592d5f59c4eb18866cff4`; `ev:T-0684:7326fe65955b4322b753e3ce` | `tests/unit/task-capsule.test.ts`; `tests/unit/task-create.test.ts`; `tests/unit/init.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused task capsule/create tests (final combined run: 3 files, 48 tests) | Yes | Passed | `ev:T-0684:62f592d5f59c4eb18866cff4`; `ev:T-0684:7326fe65955b4322b753e3ce` |
| Focused init test | Yes | Passed | `ev:T-0684:7326fe65955b4322b753e3ce` |
| TypeScript build and built CLI smoke after resolved template-escaping failure | Yes | Passed | `ev:T-0684:7b3cb542e0054aaeb7c585db`; `ev:T-0684:7326fe65955b4322b753e3ce` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Operator feedback | requirement | active | Remove the generated TASK.md lifecycle note and use `T-XXXX Title` commit messages. |

## Changes

| Area | Summary |
|---|---|
| TASK generators | Removed duplicated lifecycle prose from default and named-template scaffolds. |
| Tests | Changed scaffold assertions to reject the removed note. |
| Agent rules | Required capsule commits to use the capsule ID and title. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Existing completed capsules retain their close-source text and valid close proof. | Closed | Historical capsules are not regenerated. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-22 | Draft | Initial task scaffold. |
| 2026-07-22 | In Progress | Traced the history behavior and began the bounded generator cleanup. |
| 2026-07-22 | In Progress | Implementation and validation completed; task prose is ready for command-owned close. |
| 2026-07-22 | Done | Generator cleanup, commit convention, focused validation, build, and built CLI smoke completed. |
