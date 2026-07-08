# T-0515 0.4.1 rc0 post recycle adaptive dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0515 |
| Title | 0.4.1 rc0 post recycle adaptive dogfood |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Dogfood the current 0.4.1-rc.0 source after T-0514 through fresh `/tmp` lifecycle use and package recycle adaptive smoke. | T-0507-style dogfood should prove the workflow from the user's point of view, not only unit tests. |

## Scope

| Boundary | Items |
|---|---|
| In | Fresh governed `/tmp` project init, toy task lifecycle through `finalize --execute --auto`, validation direct-result path, representative current command surfaces, source package recycle dry-run, and live package recycle execute when network is available. |
| Out | npm publish, GitHub Release mutation, stable 0.4.1 promotion decision, broad command-portfolio removal. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Run fresh `/tmp` governed toy project dogfood through task lifecycle. | Done |
| 3 | Exercise package recycle adaptive path and record findings. | Done |
| 4 | Record report/evidence, update shared state, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh `/tmp` governed project can create, validate, and close a toy task through current `task status`, `validation run --direct-result`, and `task finalize --execute --auto`. | Done | `ev:T-0515:a20385b3ade94850976abe9c` | T-0507 pattern |
| AC-2 | Package recycle current plan includes `command-surface` and current `task-status` smoke after T-0514. | Done | `ev:T-0515:0886f8668a314f6c83be452f` | T-0514 |
| AC-3 | Live package recycle execute against `hadara@next` is attempted and either passes or records an environment/network blocker honestly. | Done | `ev:T-0515:d2ff92a938974a5983536eac`, `ev:T-0515:6a518f6681b248139ea1f343` | `hadara package recycle` |
| AC-4 | Dogfood report records confusing output, residual friction, and positive findings. | Done | `ev:T-0515:a20385b3ade94850976abe9c` | `DOGFOOD_REPORT.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Fresh `/tmp` toy lifecycle dogfood | Yes | Passed | `ev:T-0515:a20385b3ade94850976abe9c` |
| Package recycle dry-run | Yes | Passed | `ev:T-0515:0886f8668a314f6c83be452f` |
| Package recycle execute | Yes | Passed | `ev:T-0515:d2ff92a938974a5983536eac`, `ev:T-0515:6a518f6681b248139ea1f343` |
| Fresh tmp toy lifecycle dogfood | Yes | Passed | ev:T-0515:a20385b3ade94850976abe9c |
| Package recycle adaptive dry-run | Yes | Passed | ev:T-0515:0886f8668a314f6c83be452f |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | reference | active | Run T-0507-style dogfood after T-0514. |
| T-0507 dogfood report | reference | active | Pattern: fresh `/tmp` governed project, direct validation recording, finalize close, report findings. |
| T-0514 | reference | active | Package recycle helper now chooses task smoke from installed command surface. |

## Changes

| Area | Summary |
|---|---|
| Dogfood report | Added T-0507-style report with fresh toy lifecycle, package recycle adaptive path, findings, and positives. |
| Evidence | Recorded toy lifecycle, package recycle dry-run, failed sandboxed execute, approved rerun pass, and resolver evidence. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Sandboxed npm registry lookup failed slowly before approved network rerun passed; consider progress output or shorter lookup timeout in future UX work. | Open | `DOGFOOD_REPORT.md#findings` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Started T-0507-style post-recycle adaptive dogfood. |
| 2026-07-08 | Done | Fresh toy lifecycle and adaptive package recycle dogfood completed. |
