# T-0596 0.4.5 fresh and brownfield init dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0596 |
| Title | 0.4.5 fresh and brownfield init dogfood |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Verify 0.4.5 init adoption behavior in fresh and brownfield projects. | Exercise fresh `basic`, `standard`, `governed`, governed task lifecycle, brownfield adoption execute, idempotency, and fail-closed safety paths using the built CLI. |

## Scope

| Boundary | Items |
|---|---|
| In | Fresh profile init, init/docs doctor, task status, governed lifecycle close, brownfield dry-run/execute, plan-hash failure, partial repo failure, unsafe symlink failure. |
| Out | npm/GitHub publish, unrelated command portfolio changes, additional adoption feature work. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define fresh and brownfield dogfood scenarios. | Done |
| 2 | Run scenarios against the current built CLI in `/tmp`. | Done |
| 3 | Record summary, evidence, and close decision. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh `basic`, `standard`, and `governed` init all produce healthy project docs and `task status` selection output. | Done | `artifacts/dogfood-summary.json` | `DOGFOOD_REPORT.md` |
| AC-2 | Governed fresh project can create and close one authored capsule with `task finalize --execute --auto`. | Done | `artifacts/dogfood-summary.json` | `DOGFOOD_REPORT.md` |
| AC-3 | Brownfield adoption is zero-write by default and execute writes only the adoption surface after matching plan hash. | Done | `artifacts/dogfood-summary.json` | `DOGFOOD_REPORT.md` |
| AC-4 | Missing hash, mismatched hash, partial `.hadara`, and unsafe symlink cases fail closed. | Done | `artifacts/dogfood-summary.json` | `DOGFOOD_REPORT.md` |
| AC-5 | Validation evidence is recorded. | Done | `EVIDENCE.md` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| 0.4.5 init dogfood | Yes | Passed | ev:T-0596:502c67155e9345d6aeea4d26 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.5/brownfield-init-adoption.md` | reference | active | Brownfield adoption safety contract. |
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | reference | active | Registry v3 and init cleanup contract. |

## Changes

| Area | Summary |
|---|---|
| `artifacts/dogfood-summary.json` | Captured fresh and brownfield dogfood outcomes. |
| `DOGFOOD_REPORT.md` | Summarized validation coverage, results, and residual notes. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Node child-process harness can hit host `EPERM`; direct shell CLI execution remains the reliable dogfood path in this environment. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Ran fresh and brownfield init dogfood scenarios. |
| 2026-07-13 | Done | Fresh and brownfield init dogfood passed with validation evidence recorded. |
