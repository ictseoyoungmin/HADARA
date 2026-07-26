# T-0711 Automatic Validation Failure Classification

## Identity

| Field | Value |
|---|---|
| ID | T-0711 |
| Title | Automatic Validation Failure Classification |
| Status | Done |
| Created | 2026-07-26T21:46 |
| Updated | 2026-07-26T21:54 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Automatically classify validation failures as assertion, timeout, or environment setup. | Preserve low-level failureKind while adding one controlled operator-facing class. |

## Scope

| Boundary | Items |
|---|---|
| In | `validation run` JSON/plain/evidence projection, repo-local Docker failed-step/report classification, schemas, focused tests, and workflow docs/templates. |
| Out | Log disclosure, heuristic parsing of arbitrary child output, retry policy, and changing Passed/Failed/Blocked semantics. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Map existing execution signals to a controlled failureClass without parsing prose. | Done |
| 2 | Project the class through validation and Docker reports, schemas, help/docs, and evidence. | Done |
| 3 | Validate all three classes, run full/built smokes, close, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Started non-zero validation and test/build Docker steps classify as assertion. | Met | `ev:T-0711:28e345a6c1694deb87556ca7`, `ev:T-0711:f22cf345859e4a4dbfe7e219` | User instruction |
| AC-2 | Expired validation/subprocess execution classifies as timeout. | Met | `ev:T-0711:28e345a6c1694deb87556ca7`, `ev:T-0711:f22cf345859e4a4dbfe7e219` | User instruction |
| AC-3 | Launch/permission/missing-command and Docker preparation steps classify as environment-setup. | Met | `ev:T-0711:28e345a6c1694deb87556ca7`, `ev:T-0711:f22cf345859e4a4dbfe7e219` | User instruction |
| AC-4 | Status/detail and low-level failureKind remain compatible; focused/full/built validation passes. | Met | `ev:T-0711:e9a0df9c546c4394a65c13c3`, `ev:T-0711:437f9e056f7f46b2b55ef37c` | Compatibility |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused failure-class regressions | Yes | Passed | Validation/schema 37 tests and HADARA-dev Docker 10 tests passed for assertion, timeout, environment-setup, and none. | ev:T-0711:28e345a6c1694deb87556ca7 |
| Full repository validation | Yes | Passed | npm run check passed 142 public files/1108 tests and 16 HADARA-dev files/132 tests. | ev:T-0711:e9a0df9c546c4394a65c13c3 |
| Built CLI classification smoke | Yes | Passed | Fresh minimal Init built CLI classified real non-zero, deadline, and missing-command runs as assertion, timeout, and environment-setup. | ev:T-0711:f22cf345859e4a4dbfe7e219 |
| Diff and evidence hygiene | Yes | Passed | git diff --check and evidence lint passed with zero issues. | ev:T-0711:437f9e056f7f46b2b55ef37c |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Current user instruction | decision | active | Automatically distinguish assertion, timeout, and environment preparation failures. |
| Existing `failureKind` | constraint | active | Retain low-level execution diagnosis and current status semantics. |
| Privacy boundary | constraint | active | Do not expose raw captured child logs in reports. |

## Changes

| Area | Summary |
|---|---|
| Validation reports | Added controlled execution.failureClass and durable evidence summary projection. |
| Docker reports | Added report, failed-step, and issue failureClass projection. |
| Contracts/docs | Updated schemas, plain output, command notes, generated workflow, and validation guidance. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Docs live-set archival remains the next requested capsule. | Open | User instruction |

## Close Summary

Validation failures now expose controlled assertion, timeout, or environment-setup classes.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-26 | Draft | Initial task scaffold. |
| 2026-07-26 | In Progress | Implemented signal-based failure classes without child-log heuristics. |
| 2026-07-26 | Done | Focused, full, built CLI, and evidence validation passed. |
