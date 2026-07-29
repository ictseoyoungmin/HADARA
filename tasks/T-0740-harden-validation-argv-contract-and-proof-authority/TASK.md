# T-0740 Harden validation argv contract and proof authority

## Identity

| Field | Value |
|---|---|
| ID | T-0740 |
| Title | Harden validation argv contract and proof authority |
| Status | Done |
| Created | 2026-07-29T22:21 |
| Updated | 2026-07-29T22:32 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Close the remaining reviewer P1 trust-boundary gaps. | Add persisted close proof authority validation before mutation, broaden sensitive argv redaction, bound argv previews, and publish validation.run v2 without silently breaking v1 consumers. |

## Scope

| Boundary | Items |
|---|---|
| In | Validate the persisted operation marker authority before guarded writes when a direct close-plan execute has an acquired guard. |
| In | Broaden argv sensitivity classification for common secret-bearing option names and `--name=value` forms. |
| In | Bound argv previews with truncation metadata so validation JSON/evidence/TASK rows cannot grow unbounded. |
| In | Promote the current validation report shape to `hadara.validation.run.v2` and keep an explicit v1 compatibility path/schema that retains legacy `argv`. |
| Out | Full CI/GitHub Actions validation and broader validation command redesign outside the argv trust boundary. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define reviewer P1 plan and acceptance. | Done |
| 2 | Add pre-mutation persisted proof authority validation. | Done |
| 3 | Broaden argv redaction classification and add `--name=value` support. | Done |
| 4 | Add bounded argv preview metadata and use bounded preview in evidence/TASK rows. | Done |
| 5 | Split validation.run v2 from explicit v1 compatibility schema/report. | Done |
| 6 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Direct close-plan execute refuses with zero writes when the acquired guard points at a missing, malformed, or identity-mismatched persisted operation marker. | Done | ev:T-0740:5c0e76227a9c488ba3710a8f | Reviewer P1 |
| AC-2 | Argv preview redacts common secret-bearing options including `--client-secret value`, `--access-token value`, `--db-password value`, `--github-token value`, and `--client-secret=value`. | Done | ev:T-0740:5c0e76227a9c488ba3710a8f | Reviewer P1 |
| AC-3 | Argv preview has a byte budget with required metadata: preview limit, truncation state, and omitted byte count; evidence summaries and TASK rows use the bounded preview. | Done | ev:T-0740:5c0e76227a9c488ba3710a8f | Reviewer P1 |
| AC-4 | Default validation JSON reports `hadara.validation.run.v2`; v2 schema rejects legacy raw `argv`, while an explicit v1 compatibility mode/schema remains available for consumers expecting `argv`. | Done | ev:T-0740:5c0e76227a9c488ba3710a8f | Reviewer P1 |
| AC-5 | Focused validation and TypeScript checks pass with evidence recorded. | Done | ev:T-0740:5c0e76227a9c488ba3710a8f; ev:T-0740:eb7f68e3b34d41c0949464c8 | HADARA workflow |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused trust-boundary tests | Yes | Passed | exit 0 in 10863ms | ev:T-0740:5c0e76227a9c488ba3710a8f |
| TypeScript no-emit | Yes | Passed | exit 0 in 6885ms | ev:T-0740:eb7f68e3b34d41c0949464c8 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer T-0739 follow-up note | background | active | Defines persisted proof authority, argv classifier, argv preview budget, and validation.run v2/compat findings. |
| T-0739 implementation | implementation-source | active | Current close guard and validation argv redaction implementation to harden. |

## Changes

| Area | Summary |
|---|---|
| Close proof authority | Added pre-mutation persisted operation marker validation for acquired proof guards, including missing and identity-mismatched marker refusal before guarded writes. |
| Validation argv redaction | Broadened sensitive option classification to component-based long-option names and inline `--name=value` forms. |
| Validation argv preview | Added `argvPreviewLimitBytes`, `argvPreviewTruncated`, and `argvOmittedBytes`; evidence summaries and TASK validation rows use bounded redacted argv preview text. |
| Validation schema contract | Promoted default validation reports to `hadara.validation.run.v2`, added v2 schema registration, kept explicit `--compat v1` raw-argv compatibility output, and enforced `additionalProperties: false` in the runtime schema validator. |
| Docs/help | Updated CLI JSON contract and command registry help for validation.run v2 and v1 compatibility. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Schema version migration can break tests or consumers that validate only `hadara.validation.run.v1`. | Closed | v1 compatibility path retained; ev:T-0740:5c0e76227a9c488ba3710a8f |
| RF-2 | Risk | Broad argv sensitivity classification can over-redact benign option values. | Closed | Component classifier tested on expected secret-bearing names; ev:T-0740:5c0e76227a9c488ba3710a8f |
| RF-3 | Risk | Persisted authority validation must fail closed without blocking the normal public transaction close path. | Closed | task-close regression tests passed; ev:T-0740:5c0e76227a9c488ba3710a8f |

## Close Summary

T-0740 resolved the remaining reviewer P1 trust-boundary gaps. Direct close-plan execute now validates persisted proof guard authority before mutation, validation argv previews redact broader secret-bearing options and are byte-bounded, default validation JSON is `hadara.validation.run.v2`, v2 schema rejects legacy raw `argv`, and `--compat v1` remains available for legacy raw-argv consumers.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-29 | Draft | Initial task scaffold. |
| 2026-07-29 | In Progress | Started reviewer P1 trust-boundary hardening follow-up. |
| 2026-07-29 | Done | Implemented proof authority prevalidation, argv classifier and budget, validation.run v2/compat, and recorded focused validation. |
