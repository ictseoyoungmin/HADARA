# T-0576 v0.4.4 R2 external dogfood validation

## Identity

| Field | Value |
|---|---|
| ID | T-0576 |
| Title | v0.4.4 R2 external dogfood validation |
| Status | Done |
| Created | 2026-07-12 |
| Updated | 2026-07-12 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Validate the fixed v0.4.4 candidate CLI in an external standard-profile application/service workflow. | Use a disposable non-HADARA-dev project, install the locally packed CLI that includes T-0575 fixes, complete the ordinary HADARA lifecycle across multiple capsules, and document UX findings before v0.4.4 release readiness. |

## Scope

| Boundary | Items |
|---|---|
| In | Local packed HADARA CLI install into `/tmp`; standard-profile init; at least 8 external dogfood capsules unless a release-blocking defect stops the run; report metrics, good UX, frictions, bugs, and release decision impact. |
| Out | Publishing packages; deploying the dogfood app; committing the external project source into HADARA-dev; using HADARA-dev source-only validation commands inside the dogfood project. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define R2 standard-profile validation contract and prepare disposable project. | Done |
| 2 | Pack/install the fixed CLI outside HADARA-dev and initialize HADARA standard profile. | Done |
| 3 | Complete realistic service/app changes through ordinary Task Capsules. | Done |
| 4 | Capture metrics, UX findings, and release-blocking defects in an R2 report. | Done |
| 5 | Record validation evidence and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A standard-profile external dogfood project is initialized with a locally packed fixed CLI, not the HADARA-dev source command directly. | Done | `ev:T-0576:3d56c22eddb3403e952b6b13` | `tasks/T-0572-v0-4-4-external-repository-validation-planning/EXTERNAL_REPOSITORY_VALIDATION_PLAN.md` |
| AC-2 | At least 8 ordinary dogfood Task Capsules are completed, or the run stops early with a release-blocking defect. | Done | `ev:T-0576:3d56c22eddb3403e952b6b13` | `R2_DOGFOOD_REPORT.md` |
| AC-3 | R1-fixed UX surfaces are rechecked in the external project: `--version`/`-v`, installed-package stale diagnostic, bootstrap nextWork retirement, docs doctor metadata warning, and Done-level blockers. | Done | `ev:T-0576:3d56c22eddb3403e952b6b13` | T-0575 carry-forward |
| AC-4 | Findings, metrics, good UX, friction, and release impact are written to task-local report artifacts. | Done | `ev:T-0576:bb1061b47d4a45d69472ffd6` | `R2_DOGFOOD_REPORT.md` |
| AC-5 | HADARA-dev records evidence for the R2 run and closes this capsule with `closed-valid`. | Done | `ev:T-0576:95e147a95ff943b9bf3cdb7b`, `ev:T-0576:e47e8f11c2e04ab2a09bdece` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Runtime-version regression test | Yes | Passed | `ev:T-0576:95e147a95ff943b9bf3cdb7b` |
| Docker full suite and dist refresh | Yes | Passed | `ev:T-0576:e47e8f11c2e04ab2a09bdece` |
| Local package install/init smoke | Yes | Passed | `ev:T-0576:3d56c22eddb3403e952b6b13` |
| External dogfood capsule lifecycle run | Yes | Passed | `ev:T-0576:3d56c22eddb3403e952b6b13` |
| R2 report review | Yes | Passed | `ev:T-0576:bb1061b47d4a45d69472ffd6` |
| HADARA-dev finalize dry-run | Yes | Passed | `planHash sha256:b59692a9e57bd8838ce301ccf48cb37944b54f4b140f752596241cf05ae8dbae` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0572-v0-4-4-external-repository-validation-planning/EXTERNAL_REPOSITORY_VALIDATION_PLAN.md` | reference | active | R2 is standard-profile application/service validation with 8 minimum capsules unless blocked. |
| `tasks/T-0575-v0-4-4-r1-dogfood-ux-findings-cleanup/HANDOFF.md` | reference | active | Carries fixed R1 surfaces to recheck before release readiness. |
| `/tmp/hadara-r2-standard-dogfood-rerun3` | reference | active | Disposable external project; do not commit raw source into HADARA-dev. |

## Changes

| Area | Summary |
|---|---|
| Runtime version diagnostics | Prevent installed package binaries under non-HADARA project roots from being compared against unrelated project source mtimes. |
| R2 external dogfood | Completed 8 standard-profile capsules in `/tmp/hadara-r2-standard-dogfood-rerun3` and documented findings. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | The local packed CLI still reports package version `0.4.3` because v0.4.4 is unreleased; use behavior checks, not version number alone, to identify the candidate build. | Open | `npm pack` artifact |
| RF-2 | Follow-up | Host/tool validation wrapper spawn EPERM still requires direct-result fallback in this environment. | Open | `.hadara/local/feedback/T-0576-validation-wrapper-direct-fallback.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-12 | Draft | Initial task scaffold. |
| 2026-07-12 | In Progress | Defined R2 standard-profile external dogfood contract. |
| 2026-07-12 | Done | Completed R2 external dogfood, fixed installed-package stale diagnostic, and recorded findings. |
