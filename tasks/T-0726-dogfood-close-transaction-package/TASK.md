# T-0726 Dogfood Close Transaction Package

## Identity

| Field | Value |
|---|---|
| ID | T-0726 |
| Title | Dogfood Close Transaction Package |
| Status | Done |
| Created | 2026-07-28T18:58 |
| Updated | 2026-07-28T19:06 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Dogfood the rc2 close transaction through an installed package. | Pack and install the current build, run governed init/task close flows from the installed CLI, and fix any close-transaction blocker found by that path. |

## Scope

| Boundary | Items |
|---|---|
| In | Installed tarball smoke, governed init, task create, blocked close, clean close, retry no-op, and the minimal harness parser fix discovered by dogfood. |
| Out | Publishing, network registry install, broad fault matrix beyond the installed smoke, additional capsules beyond the user-requested four. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Run installed package close dogfood and fix immediate blocker. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Installed package governed init and task create pass from a tarball install. | Met | ev:T-0726:9e8c145718bc4ffdb8d39fbc | rc2 installed dogfood |
| AC-2 | Installed `task close` blocks incomplete capsule with zero close proof writes, then closes clean fixture to `closed-valid`. | Met | ev:T-0726:9e8c145718bc4ffdb8d39fbc | rc2 installed dogfood |
| AC-3 | Installed identical retry is a no-op with `closeProofAppended:false`. | Met | ev:T-0726:9e8c145718bc4ffdb8d39fbc | rc2 installed dogfood |
| AC-4 | Full repo validation passes after the installed dogfood fix. | Met | ev:T-0726:9887ae80871749bea0530aac | HADARA protocol |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Installed package close dogfood | Yes | Passed | Packed hadara-0.5.0-rc.1 with /tmp npm cache, installed tarball into /tmp project, ran installed governed init, task create, blocked close, clean close closed-v | ev:T-0726:9e8c145718bc4ffdb8d39fbc |
| Focused harness and close tests | Yes | Passed | npm test -- --run tests/unit/task-close.test.ts tests/unit/harness-validate.test.ts tests/unit/init.test.ts passed: 2 files / 65 tests | ev:T-0726:3ac0d61a87ea435f9d163e75 |
| TypeScript build | Yes | Passed | npm run build passed before installed package dogfood | ev:T-0726:a94142ac355a45fc8e924713 |
| Full check | Yes | Passed | npm run check passed: public 136 files/1069 tests, HADARA-dev 16 files/134 tests | ev:T-0726:9887ae80871749bea0530aac |
| Diff hygiene | Yes | Passed | git diff --check passed | ev:T-0726:98a86ae0fd384353a2737ad9 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md | constraint | active | Installed-package dogfood requirement. |
| src/harness/validate.ts | implementation-source | active | Done-level Task Board validation parser fixed for Init v1 Board shape. |
| src/task/task-board.ts | implementation-source | active | Shared Task Board parser reused by harness. |
| tests/unit/task-close.test.ts | implementation-source | active | Close transaction regressions still pass. |

## Changes

| Area | Summary |
|---|---|
| Installed dogfood | Packed current build using `/tmp` npm cache, installed tarball in `/tmp/hadara-installed-dogfood`, initialized a governed project, created a task, observed blocked incomplete close, then closed and retried cleanly. |
| Harness validation | Replaced the harness-local legacy Task Board row parser with shared `parseTaskBoard()` so Init v1 `Targets | Capsule | Result` rows validate correctly. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | T-0726 covered installed clean, blocked, and retry dogfood. Remaining rc2 fault-matrix rows were carried into T-0727 for source-level hook, lock, write, and proof-pending coverage. | Residual | tasks/T-0727-complete-close-transaction-fault-matrix/TASK.md |

## Close Summary

T-0726 packed and installed the current build, then ran installed governed init, task create, blocked close, clean close, and identical retry. Dogfood found that done-level harness validation still parsed Task Board rows as legacy `ID | Title | Status | Capsule | Notes`; this was fixed by reusing the shared Init v1-aware Task Board parser. Focused tests, TypeScript build, installed dogfood, and full check passed. Remaining rc2 fault-matrix hardening continues in T-0727.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | In Progress | Ran installed package close dogfood and fixed Task Board parsing blocker. |
| 2026-07-28 | Done | Completed installed dogfood and full validation. |
