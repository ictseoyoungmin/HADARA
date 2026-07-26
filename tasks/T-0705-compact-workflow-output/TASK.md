# T-0705 Compact Workflow Output

## Identity

| Field | Value |
|---|---|
| ID | T-0705 |
| Title | Compact Workflow Output |
| Status | Done |
| Targets | project |
| Created | 2026-07-26T19:48 |
| Updated | 2026-07-26T20:04 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make ordinary task status and close output small enough to guide the next action without hiding an opt-in full diagnostic report. | Default JSON shows only task identity, phase/readiness, focused reads/edits, next action, counts, and compact issues; `--detail full --json` preserves the complete report. |

## Scope

| Boundary | Items |
|---|---|
| In | Compact default JSON projections for task status and task close; focused read/edit routing; `--detail full` for complete JSON/text diagnostics; concise close progress behavior; help/docs/tests. |
| Out | Validation token redesign; shared-state automation; Docker low-resource mode; failure classification; bulk docs archival; changes to close proof or lifecycle semantics. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Freeze compact fields and preserve the existing full report behind `--detail full`. | Done |
| 2 | Route status/close default output through compact projections and add focused tests. | Done |
| 3 | Validate, refresh built CLI, record evidence, update handoff/state, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Default `task status --json` emits a compact report with focused required reads and concrete edit points; `--detail full --json` emits the complete v2 report. | Met | `ev:T-0705:41bc27f1695944708e56e13c`, `ev:T-0705:7e7df6481737405e9431844f` | User instruction |
| AC-2 | Default `task close --json` emits a compact summary and suppresses verbose progress; `--detail full --json` preserves the complete v2 transaction and progress diagnostics. | Met | `ev:T-0705:41bc27f1695944708e56e13c`, `ev:T-0705:7e7df6481737405e9431844f` | User instruction |
| AC-3 | Existing lifecycle semantics and full-report schemas remain valid, and focused/full validation plus built CLI smokes pass. | Met | `ev:T-0705:b836324ba03349609da40acf`, `ev:T-0705:fb9501c035f046e5975b1509` | `docs/TEST_STRATEGY.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused status/close CLI tests | Yes | Passed | `ev:T-0705:41bc27f1695944708e56e13c` |
| Full repository validation | Yes | Passed | `ev:T-0705:b836324ba03349609da40acf` |
| Built CLI compact/full output smoke | Yes | Passed | `ev:T-0705:7e7df6481737405e9431844f` |
| Diff and evidence hygiene | Yes | Passed | ev:T-0705:fb9501c035f046e5975b1509 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Current user instruction | decision | active | Compress ordinary status/close output; keep detailed JSON opt-in. |
| `docs/CLI_JSON_CONTRACT.md` | constraint | active | Preserve explicit machine-readable full reports. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Keep status-first and proof-last close semantics. |
| `docs/ARCHITECTURE.md` | constraint | active | Reuse shared reports without changing lifecycle ownership. |
| `docs/TEST_STRATEGY.md` | constraint | active | Validate public and HADARA-dev surfaces. |

## Changes

| Area | Summary |
|---|---|
| Status output | Default JSON is now a bounded `hadara.task.status.summary.v1` projection with one focused read/edit route, compact issues, and an explicit full-detail command. |
| Close output | Default JSON is now `hadara.task.close.summary.v1` and omits phase progress; `--detail full --json` retains the complete v2 transaction and diagnostics. |
| Contracts and tests | Updated CLI help, compatibility metadata, workflow/JSON docs, focused regressions, dogfood expectations, and refreshed `dist`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Validation result/detail separation remains the next requested capsule. | Open | User instruction |
| RF-2 | Follow-up | Shared-state projection automation, low-resource Docker mode, failure classification, and docs archival remain ordered later capsules. | Open | User instruction |

## Close Summary

Compact task status and close summaries are now default; complete v2 diagnostics remain available through --detail full.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-26 | Draft | Initial task scaffold. |
| 2026-07-26 | In Progress | Started compact default status/close output in the home-directory ext4 clone. |
| 2026-07-26 | Done | Compact projections, opt-in full reports, docs, tests, built CLI smokes, and evidence hygiene passed. |
