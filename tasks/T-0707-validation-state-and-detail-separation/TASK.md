# T-0707 Validation State and Detail Separation

## Identity

| Field | Value |
|---|---|
| ID | T-0707 |
| Title | Validation State and Detail Separation |
| Status | Done |
| Targets | project |
| Created | 2026-07-26T21:05 |
| Updated | 2026-07-26T21:15 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Separate Validation machine state from human explanation in CLI reports and Task Capsule rows. | Keep legacy Result readers compatible while new capsules use explicit Status and Detail columns. |

## Scope

| Boundary | Items |
|---|---|
| In | `validation run` status/detail JSON and text; new Task Capsule Validation table; legacy table compatibility; schema/help/docs/tests. |
| Out | Failure-category classification, shared-state projection, Docker resource modes, and historical docs archival. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the canonical Validation status/detail ownership and compatibility boundary. | Done |
| 2 | Implement status/detail reports and new Capsule rows while preserving legacy Result tables. | Done |
| 3 | Validate, record evidence, update continuation docs, close, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | JSON and plain output expose a controlled Status independently from bounded Detail text. | Met | `ev:T-0707:8d63f3565923487a9fff636f` | User instruction |
| AC-2 | New Task Capsules use separate Status and Detail columns, while existing Result tables still validate and update. | Met | `ev:T-0707:9bb6afc26d1645a9b6cf8d15` | Compatibility |
| AC-3 | Focused/full tests and built CLI smoke pass with current `dist`. | Met | `ev:T-0707:a20e025f62764413bcdd8b09`, `ev:T-0707:d7dd091dd41c407590f65eda` | `docs/TEST_STRATEGY.md` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused Validation regressions | Yes | Passed | Four focused files passed 77 tests. | `ev:T-0707:9bb6afc26d1645a9b6cf8d15` |
| Full repository validation | Yes | Passed | Public 1104 and HADARA-dev 129 tests passed. | `ev:T-0707:a20e025f62764413bcdd8b09` |
| Built CLI status/detail smoke | Yes | Passed | JSON fields and five-column row update passed. | `ev:T-0707:8d63f3565923487a9fff636f` |
| Diff and evidence hygiene | Yes | Passed | Diff and evidence lint reported zero issues. | `ev:T-0707:d7dd091dd41c407590f65eda` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Current user instruction | decision | active | Separate Validation status tokens from descriptions. |
| `docs/CLI_JSON_CONTRACT.md` | constraint | active | Machine state must not depend on parsing prose. |
| `docs/TEST_STRATEGY.md` | constraint | active | Validate source, built CLI, and compatibility behavior. |

## Changes

| Area | Summary |
|---|---|
| Validation model | Added canonical `status` and bounded `detail`; retained `result` as a deprecated compatibility alias. |
| Task Capsule | New scaffolds and templates use `Status | Detail`; harness and updater retain legacy Result-table support. |
| Operator contract | Plain output, schema, help metadata, CLI JSON contract, and workflow docs now describe the split. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Automatic failure classification consumes the new status/detail boundary later. | Open | User instruction |
| RF-2 | Follow-up | Shared projection, HADARA-dev-only low-resource Docker, and docs archival remain ordered capsules. | Open | User instruction |

## Close Summary

Validation state tokens and human detail are now separate in CLI reports and new Task Capsule rows.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-26 | Draft | Initial task scaffold. |
| 2026-07-26 | In Progress | Added the status/detail contract, new Capsule table, and legacy Result compatibility. |
| 2026-07-26 | Done | Focused, full, built CLI, diff, and evidence validation passed. |
