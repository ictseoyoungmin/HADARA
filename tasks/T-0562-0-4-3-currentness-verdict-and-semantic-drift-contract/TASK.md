# T-0562 0.4.3 currentness verdict and semantic drift contract

## Identity

| Field | Value |
|---|---|
| ID | T-0562 |
| Title | 0.4.3 currentness verdict and semantic drift contract |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Add an explicit clean/warning/drifted currentness verdict and semantic state drift diagnostics to docs doctor. | Preserve the existing health field and command/schema compatibility. |

## Scope

| Boundary | Items |
|---|---|
| In | Additive docs doctor semantics/currentness fields; structured state/Markdown/Task Board semantic drift mapping; schema/text output/docs/tests; HADARA-dev currentness verification. |
| Out | Renaming/removing existing `health`; new public command; auto-remediation; workflow measurement; release version bump or publish execution. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define additive ok/health/currentness semantics and drift classification. | Done |
| 2 | Integrate semantic state drift into docs doctor and schema/output. | Done |
| 3 | Add clean/warning/drifted regressions and run focused/full validation. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `ok`, legacy `health`, and additive `currentnessVerdict` have explicit non-overlapping semantics. | Met | ev:T-0562:fdb86185f3aa44c191156f8e | docs doctor schema/service |
| AC-2 | Canon/projection/task-state mismatches become semantic drift issues and a drifted verdict. | Met | ev:T-0562:41732b262e1d4b998b1f54ae | docs doctor tests |
| AC-3 | Non-currentness warnings produce `warning`, while a clean project produces `clean`. | Met | ev:T-0562:41732b262e1d4b998b1f54ae | docs doctor tests |
| AC-4 | JSON schema, focused tests, and full Docker validation pass without a new command. | Met | ev:T-0562:fdb86185f3aa44c191156f8e, ev:T-0562:f3c88bbcbbc1461e9fa75015 | validation evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Docs doctor currentness and semantic drift focused tests | Yes | Passed | ev:T-0562:41732b262e1d4b998b1f54ae |
| Command/schema compatibility regressions | Yes | Passed | ev:T-0562:fdb86185f3aa44c191156f8e |
| Full Docker sync-build | Yes | Passed | ev:T-0562:f3c88bbcbbc1461e9fa75015 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User P0/v0.4.3 request | constraint | active | Provide clean/warning/drifted currentness separately from ok. |
| T-0561 structured current-state contract | implementation-source | active | Canon/projection drift is a semantic docs currentness signal. |
| docs/CLI_JSON_CONTRACT.md | constraint | active | Additive patch-release JSON evolution. |

## Changes

| Area | Summary |
|---|---|
| docs doctor report | Added explicit semantics, exact currentness verdict, and semantic drift count while preserving health. |
| state diagnostics | Added lightweight canon/projection/Task Board semantic inspection without the full projection scan. |
| contracts/docs | Updated JSON schema, CLI JSON contract, and README operator semantics. |
| regressions | Covered clean, ordinary warning, stale guidance drift, and managed projection drift. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Full state projection adds bounded docs-doctor cost on very large repositories. | Mitigated | Measure current HADARA-dev runtime and keep issue mapping narrow. |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Additive verdict and semantic drift scope accepted. |
| 2026-07-10 | Done | Additive verdict, semantic drift diagnostics, contracts, and Docker validation completed. |
