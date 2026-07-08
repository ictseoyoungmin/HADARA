# T-0535 Post-dead-code fresh tmp dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0535 |
| Title | Post-dead-code fresh tmp dogfood |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Refresh `dist` and dogfood the current development CLI in a fresh `/tmp` HADARA project after T-0534 dead-code cleanup. | Verify scaffold docs, command surface, task lifecycle, evidence capture, and finalize still work from a clean project. |

## Scope

| Boundary | Items |
|---|---|
| In | Run Docker sync-build, initialize a fresh governed `/tmp` project with `node /mnt/f/NowWorking/HADARA-dev/dist/cli/main.js`, create and close one toy Task Capsule, inspect generated scaffold docs/current guidance, and record UX findings in a DOGFOOD report. |
| Out | Do not modify product code unless the dogfood finds a blocking bug. Do not use global `hadara`; use the freshly synced workspace `dist` entry point. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the dogfood contract and refresh development `dist` with Docker sync-build. | Done |
| 2 | Create a fresh `/tmp` governed project and inspect generated scaffold docs. | Done |
| 3 | Create a toy task, make a small implementation change, record validation, and finalize with `--execute --auto`. | Done |
| 4 | Exercise representative read/diagnostic command surfaces and write a structured dogfood report. | Done |
| 5 | Record evidence, update state docs, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Docker sync-build refreshes `dist` before dogfood. | Done | `ev:T-0535:790f953ae3674eeda652dbf2` | `docs/HADARA_WORKFLOW.md` |
| AC-2 | Fresh `/tmp` governed init succeeds and generated scaffold docs are reviewed for stale removed-command guidance. | Done | `ev:T-0535:229bd625b59d4eeea0007435` | `/tmp/hadara-t0535-dogfood-XzmP7N` |
| AC-3 | A toy Task Capsule closes through current lifecycle using `task status`, `validation run`, and `task finalize --execute --auto`. | Done | `ev:T-0535:229bd625b59d4eeea0007435` | `/tmp/hadara-t0535-dogfood-XzmP7N/tasks/T-0001-implement-word-statistics-utility` |
| AC-4 | Dogfood report captures blockers, frictions, positives, and follow-ups. | Done | `ev:T-0535:ce3a1f50232c4a7388216e72` | `DOGFOOD_REPORT.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Docker sync-build | Yes | Passed | ev:T-0535:790f953ae3674eeda652dbf2 |
| Fresh `/tmp` dogfood lifecycle | Yes | Passed | ev:T-0535:229bd625b59d4eeea0007435 |
| Dogfood report review | Yes | Passed | ev:T-0535:ce3a1f50232c4a7388216e72 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/HADARA_WORKFLOW.md` | reference | active | Requires Docker sync-build before built-CLI smokes for HADARA-dev CLI work. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Current lifecycle path: status/finalize/validation; removed low-level surfaces should not be recommended. |
| `tasks/T-0507-0-4-1-rc0-validation-wrapper-spawn-fallback-closure/DOGFOOD_REPORT.md` | reference | active | Prior dogfood style for structured findings. |

## Changes

| Area | Summary |
|---|---|
| `dist` | Refreshed through Docker sync-build before fresh-project dogfood. |
| `/tmp/hadara-t0535-dogfood-XzmP7N` | Initialized governed scaffold, implemented and closed toy `T-0001` through current lifecycle. |
| `DOGFOOD_REPORT.md` | Recorded command coverage, positives, findings, artifacts, and follow-ups. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `task status --detail full` still has stale fix hints that mention removed `task finish`. | Open | `DOGFOOD_REPORT.md` |
| RF-2 | Follow-up | Check whether `session start` docs read-map counts intentionally include entries omitted from the visible array. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Refreshed development `dist`, dogfooded a fresh governed `/tmp` project, and recorded findings. |
