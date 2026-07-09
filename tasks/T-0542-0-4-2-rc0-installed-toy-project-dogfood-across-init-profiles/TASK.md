# T-0542 0.4.2 rc0 installed toy project dogfood across init profiles

## Identity

| Field | Value |
|---|---|
| ID | T-0542 |
| Title | 0.4.2 rc0 installed toy project dogfood across init profiles |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Dogfood the published `hadara@0.4.2-rc.0` package in fresh toy projects across all init profiles. | Use the installed npm package, follow generated workflow docs, complete a small governed-profile MVP with about three capsules, and capture CLI/document UX findings. |

## Scope

| Boundary | Items |
|---|---|
| In | `basic`, `standard`, and `governed` init profile scaffolds; installed-package CLI checks; governed-profile Taskflow Toy MVP across T-0001/T-0002/T-0003; final dogfood report. |
| Out | Fixing the findings discovered by dogfood, publishing the toy app, and committing `/tmp` project contents. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Install `hadara@next` into an isolated `/tmp` prefix and verify version. | Done |
| 2 | Initialize `basic`, `standard`, and `governed` profiles and inspect generated docs. | Done |
| 3 | Build Taskflow Toy in the governed profile using three Task Capsules. | Done |
| 4 | Exercise core and supplementary CLI surfaces. | Done |
| 5 | Write structured dogfood report and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara@0.4.2-rc.0` is installed from npm and used directly, not via source checkout. | Done | `ev:T-0542:7c7aae7945b94710821bcd45` | `artifacts/DOGFOOD_REPORT.md` |
| AC-2 | All three init profiles are dogfooded with scaffold and docs/status checks. | Done | `ev:T-0542:7c7aae7945b94710821bcd45` | `artifacts/DOGFOOD_REPORT.md` |
| AC-3 | A real governed-profile toy MVP is completed through about three Task Capsules. | Done | `ev:T-0542:7c7aae7945b94710821bcd45` | `artifacts/DOGFOOD_REPORT.md` |
| AC-4 | CLI output issues, generated-doc issues, good points, and follow-ups are captured. | Done | `ev:T-0542:7c7aae7945b94710821bcd45` | `artifacts/DOGFOOD_REPORT.md`; `.hadara/local/feedback/T-0542-installed-package-dogfood-findings.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Installed package toy-project dogfood | Yes | Passed | ev:T-0542:7c7aae7945b94710821bcd45 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `AGENTS.md` | constraint | active | Requires HADARA lifecycle, Docker/source boundaries for HADARA-dev, and task-local evidence. |
| `/tmp/hadara-t0542-dogfood` | implementation-source | active | Fresh installed-package dogfood workspace. |
| `tasks/T-0539-0-4-2-rc0-release-readiness-and-publish-preparation/TASK.md` | reference | active | Confirms 0.4.2-rc.0 release context. |

## Changes

| Area | Summary |
|---|---|
| Dogfood artifact | Added `artifacts/DOGFOOD_REPORT.md` with profile matrix, command coverage, positives, and findings. |
| Local feedback | Added non-commit feedback under `.hadara/local/feedback/` for source-checkout leakage and first-task guidance issues. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Fix installed-package `context pack` source-checkout leakage for consumer projects. | Open | `artifacts/DOGFOOD_REPORT.md` |
| RF-2 | Follow-up | Add empty-project first-task guidance to `task status --json`. | Open | `artifacts/DOGFOOD_REPORT.md` |
| RF-3 | Follow-up | Improve handoff recommendation matching once a similar open task already exists. | Open | `artifacts/DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | Done | Completed installed-package toy-project dogfood across all init profiles. |
