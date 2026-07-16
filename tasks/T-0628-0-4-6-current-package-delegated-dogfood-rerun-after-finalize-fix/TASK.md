# T-0628 0.4.6 current-package delegated dogfood rerun after finalize fixes

## Identity

| Field | Value |
|---|---|
| ID | T-0628 |
| Title | 0.4.6 current-package delegated dogfood rerun after finalize fixes |
| Status | Done |
| Created | 2026-07-16 |
| Updated | 2026-07-16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0628 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Verify the T-0626/T-0627 finalize fixes by rerunning delegated Codex dogfood from a clean external project using a freshly packed current source package. | Stable promotion requires the delegated agent to close the baseline capsule and complete at least one MVP feature capsule without manual lifecycle-owned status edits. |

## Scope

| Boundary | Items |
|---|---|
| In | Pack current source, install into a clean `/mnt/f/NowWorking/dev` dogfood project, run governed init, delegate Codex to build Quant Battle Arena through HADARA capsules, inspect results, and record stable readiness. |
| Out | Publishing npm/GitHub stable, broad product refactors unrelated to the dogfood result. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define rerun contract and delegated prompt. | Done |
| 2 | Pack/install current package into a clean external project. | Done |
| 3 | Delegate Codex and inspect generated docs/tasks/software. | Done |
| 4 | Record stable readiness recommendation. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current package installs and `init doctor` passes in a clean external governed project. | Met | `ev:T-0628:28015bcec2a84cb285534883` | package smoke |
| AC-2 | Delegated Codex closes the baseline capsule without manual lifecycle-owned status edits. | Met | `ev:T-0001:b640f476c00f4b8bb18a9438` | external dogfood |
| AC-3 | Delegated Codex closes at least one Quant Battle Arena MVP feature capsule or records a new blocker. | Met | `ev:T-0002:f1444383bf974354a55a6fb7` | external dogfood |
| AC-4 | Stable readiness recommendation is documented. | Met | `tasks/T-0628-0-4-6-current-package-delegated-dogfood-rerun-after-finalize-fix/DOGFOOD_REPORT.md` | DOGFOOD_REPORT.md |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Current package install/init smoke | Yes | Passed | `ev:T-0628:28015bcec2a84cb285534883` |
| Delegated Codex dogfood rerun | Yes | Passed | `ev:T-0001:b640f476c00f4b8bb18a9438`, `ev:T-0002:f1444383bf974354a55a6fb7` |
| Generated output review | Yes | Passed | `tasks/T-0628-0-4-6-current-package-delegated-dogfood-rerun-after-finalize-fix/DOGFOOD_REPORT.md` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0625-0-4-6-rc1-current-package-codex-dogfood-before-stable/DOGFOOD_REPORT.md` | reference | active | Baseline blocker this rerun must prove fixed. |
| `tasks/T-0626-0-4-6-atomic-finalize-auto-close-preflight/TASK.md` | reference | active | Atomic finalize auto close preflight fix. |
| `tasks/T-0627-0-4-6-finalize-validation-placeholder-semantics-cleanup/TASK.md` | reference | active | Finalize validation row placeholder fix. |
| `/mnt/f/NowWorking/dev` | constraint | active | External dogfood root. |

## Changes

| Area | Summary |
|---|---|
| External dogfood | Created `/mnt/f/NowWorking/dev/hadara-046-current-dogfood-rerun`, installed the current tarball, initialized governed HADARA, and delegated Codex to follow generated docs. |
| Baseline close | External `T-0001` closed-valid without lifecycle-owned status hand edits. |
| MVP feature close | External `T-0002` built and closed a stdlib Quant Battle Arena MVP with CLI, sample data, strategy template, and HTML report. |
| Report | Added `DOGFOOD_REPORT.md` with stable readiness and residual UX findings. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Add source role/state aliases or clearer schema hints for natural first-user task-table tokens. | Open | `.hadara/local/feedback/T-0628-delegated-dogfood-residuals.md` |
| RF-2 | Follow-up | Improve Python validation command examples or wrapper hints when only `python3` exists. | Open | `.hadara/local/feedback/T-0628-delegated-dogfood-residuals.md` |
| RF-3 | Follow-up | Clarify or expose a helper for updating the current trusted validation baseline after meaningful validation. | Open | `.hadara/local/feedback/T-0628-delegated-dogfood-residuals.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-16 | Draft | Initial task scaffold. |
| 2026-07-16 | In Progress | Starting current-package delegated dogfood rerun after finalize fixes. |
| 2026-07-16 | Done | Delegated dogfood passed baseline close and MVP feature close; residual UX findings recorded. |
