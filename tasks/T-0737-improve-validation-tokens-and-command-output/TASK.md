# T-0737 Improve validation tokens and command output

## Identity

| Field | Value |
|---|---|
| ID | T-0737 |
| Title | Improve validation tokens and command output |
| Status | Done |
| Created | 2026-07-29T19:34 |
| Updated | 2026-07-29T19:39 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make close/debug diagnostics match rc2 authoring behavior. | Add the missing `design` source role token, make invalid `Done` risk states point authors to `Closed`, and surface validation child output for debugging without storing raw logs as evidence. |

## Scope

| Boundary | Items |
|---|---|
| In | Controlled vocabulary and harness diagnostics for source roles and risk states; `validation run` captured-output reporting; focused tests and evidence. |
| Out | Project-level vocabulary override files; automatic mutation of TASK.md authoring tokens; changing evidence JSONL to persist raw stdout/stderr. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `design` is an allowed source role token and is exposed through the schema vocabulary report. | Done | ev:T-0737:906bfe6fa3c04c47ad3d4319 | User close dry-run feedback |
| AC-2 | Risk state `Done` remains invalid but diagnostics guide authors to `Closed` instead of expanding the state token set. | Done | ev:T-0737:906bfe6fa3c04c47ad3d4319 | User close dry-run feedback |
| AC-3 | `validation run` surfaces captured child stdout/stderr for debugging while evidence remains hash/summary based. | Done | ev:T-0737:bbab4b01a0854dc0a32da760 | User validation-run feedback |
| AC-4 | Focused validation passes and evidence is recorded. | Done | ev:T-0737:906bfe6fa3c04c47ad3d4319; ev:T-0737:a8f99f27c0474e0fbb53b12e | HADARA workflow |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused tests | Yes | Passed | exit 0 in 5607ms | ev:T-0737:906bfe6fa3c04c47ad3d4319 |
| TypeScript no-emit | Yes | Passed | exit 0 in 10088ms | ev:T-0737:a8f99f27c0474e0fbb53b12e |
| Output preview smoke | Yes | Passed | exit 0 in 55ms | ev:T-0737:bbab4b01a0854dc0a32da760 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | background | active | Asked to add the recommended token/hint behavior and show original validation command output for debugging. |
| src/services/controlled-vocabulary.ts | implementation-source | active | Canonical TASK.md token sets and schema report source. |
| src/harness/validate.ts | implementation-source | active | Harness token diagnostics. |
| src/services/validation-run.ts | implementation-source | active | Validation command execution report and capture model. |
| src/cli/validation.ts | implementation-source | active | Non-JSON validation run output. |
| tests/harness/harness-validate.test.ts | implementation-source | active | Harness token regression coverage. |
| tests/unit/validation-run.test.ts | implementation-source | active | Validation run report and CLI output coverage. |

## Changes

| Area | Summary |
|---|---|
| Controlled vocabulary | Added `design` to canonical TASK.md source role tokens and schema lookup output. |
| Harness diagnostics | Kept risk state `Done` invalid and added a targeted hint/example to use `Closed` for completed follow-ups. |
| Validation run | Added bounded stdout/stderr previews to execution capture and prints child stdout/stderr in non-JSON output. |
| Tests | Added focused coverage for vocabulary, harness diagnostics, schema lookup, and validation output rendering. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Raw validation output can contain sensitive local details, so this task exposes bounded debug previews and avoids persisting raw logs into evidence summaries. | Closed | ev:T-0737:bbab4b01a0854dc0a32da760 |

## Close Summary

T-0737 adds the missing `design` source role token, keeps risk state `Done` out of the allowed risk vocabulary while giving authors a `Closed` fix hint, and makes `validation run` expose captured child stdout/stderr previews for debugging. Focused tests and TypeScript no-emit passed and evidence was recorded.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-29 | Draft | Initial task scaffold. |
| 2026-07-29 | In Progress | Scoped token diagnostics and validation output behavior. |
| 2026-07-29 | Done | Implemented token diagnostics, validation output previews, tests, and evidence. |
