# T-0664 nextWork origin tracking: fix F-2 stuck bootstrap retirement and add stale-bootstrap advisory

## Identity

| Field | Value |
|---|---|
| ID | T-0664 |
| Title | nextWork origin tracking: fix F-2 stuck bootstrap retirement and add stale-bootstrap advisory |
| Status | Done |
| Created | 2026-07-20T18:47 |
| Updated | 2026-07-20T19:09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0664 --json`.

## Goal

| Goal | Notes |
|---|---|
| Replace the three separate, duplicated, title-string-matching "is this bootstrap guidance" detectors (in `project-current-state.ts`, `task-selection.ts`, and `session-start.ts`) with a single authoritative `nextWork.origin` field set once at creation time, fixing T-0663's F-2 (adoption-baseline `nextWork` permanently stuck once its one title-matching retirement chance is missed) at the root, and add a proactive advisory that detects the stuck state for already-affected projects. | Discovered as F-2 during T-0663's delegated dogfood; reproduced independently outside the dogfood project, confirming it is not specific to that incident. |

## Scope

| Boundary | Items |
|---|---|
| In | `ProjectNextWorkOrigin` type (`'bootstrap-first-task' \| 'bootstrap-adoption-baseline' \| 'declared'`) and `origin` field on `ProjectNextWork` in `src/services/project-current-state.ts`, with back-compat inference for `origin`-less legacy `nextWork` values on read; `hasBootstrapNextWork()` generalized to retire on `origin !== 'declared'` regardless of which task closes (fixes F-2); `src/init/adoption.ts`'s brownfield seed sets `origin: 'bootstrap-adoption-baseline'`; `src/task/task-selection.ts`'s two title-matching bootstrap checks replaced with `nextWork.origin` checks (removes the now-redundant `isBootstrapFirstTaskNextWork`/`isBootstrapAdoptionBaselineNextWork` helpers); `src/context/session-start.ts`'s `scrubBootstrapNextWorkForSession` replaced with an `origin` check (this file previously only recognized the first-task phrase, not the adoption-baseline one — a third occurrence of the same gap); a new `STATE_CURRENT_CANON_STALE_BOOTSTRAP_NEXT_WORK` advisory in `inspectProjectCurrentStateSemantics` for projects where a bootstrap-origin `nextWork` survives past the first completed task (surfaces through `docs doctor`/`protocol doctor` via `docs-registry.ts`'s `semanticStateDriftIssues`); schema update for `nextWork.origin`; regression tests; a repro test proving F-2's stuck-forever scenario no longer occurs; F-3 re-verified end-to-end via a manual repro against the built CLI (confirmed resolved as a direct consequence of the F-2 fix, no separate precedence logic needed); F-1's docs fix folded in (a PATH-precedence warning added to the generated `docs/HADARA_WORKFLOW.md` "Installed Package Fallback" template in `src/init/templates.ts`, plus this repo's own already-generated `docs/HADARA_WORKFLOW.md` updated to match). |
| Out | Any DAG evaluator/registry wiring from the earlier Phase A/B work; retroactively repairing `/mnt/f/NowWorking/dev/driftlog`'s already-corrupted state (external dogfood project, out of this repo's scope); reconciling this repo's own `docs/HADARA_WORKFLOW.md` pre-existing npm-specific wording drift from the generic-package-manager template (unrelated, predates this capsule). |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Add `ProjectNextWorkOrigin`/`origin` to `ProjectNextWork`, with back-compat inference on read and origin set on all write paths (`createInitialProjectCurrentState`, `nextWorkFromLegacyIntent`, `src/init/adoption.ts`). | Done |
| 2 | Generalize `hasBootstrapNextWork()` to use `origin`; update the schema. | Done |
| 3 | Replace `task-selection.ts`'s and `session-start.ts`'s title-matching bootstrap checks with `origin` checks. | Done |
| 4 | Add the `STATE_CURRENT_CANON_STALE_BOOTSTRAP_NEXT_WORK` advisory. | Done |
| 5 | Verify F-3 no longer reproduces (manual end-to-end repro against built CLI); fix F-1's docs warning. | Done |
| 6 | Add regression tests (retirement, back-compat inference, task-selection/session-start behavior parity, advisory) and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A bootstrap-origin `nextWork` retires when *any* task closes, not only the one task whose title happens to match it — the exact F-2 repro (adoption-baseline task closes, then an unrelated feature task closes) now leaves `nextWork: null`. | Met | ev:T-0664:c21d4948ff8d4806b61fc112 | src/services/project-current-state.ts, tests/unit/next-work-origin.test.ts |
| AC-2 | Legacy `current.json` files without `origin` normalize correctly (inferred from title) without error, and re-serialize with `origin` present going forward. | Met | ev:T-0664:c21d4948ff8d4806b61fc112 | tests/unit/next-work-origin.test.ts |
| AC-3 | `task-selection.ts` and `session-start.ts` produce identical behavior to before for both bootstrap phrases, now driven by `origin` instead of duplicated title matching. | Met | ev:T-0664:c21d4948ff8d4806b61fc112 | tests/unit/task-selection.test.ts, tests/unit/session-start.test.ts (unchanged, still passing) |
| AC-4 | A project with a stuck bootstrap `nextWork` past its first completed task surfaces `STATE_CURRENT_CANON_STALE_BOOTSTRAP_NEXT_WORK` via `inspectProjectCurrentStateSemantics`. | Met | ev:T-0664:c21d4948ff8d4806b61fc112 | tests/unit/next-work-origin.test.ts |
| AC-5 | No existing CLI command output changes for projects with `nextWork: null` or normal `declared` next work. | Met | ev:T-0664:ccd90916a8c841b98d58a663 | build + full suite |
| AC-6 | F-3 no longer reproduces once F-2 is fixed: a fresh brownfield-adopted project whose adoption task closes under an unrelated-titled feature task now shows `phase: "continuation-ready"` (not stale `"review-next-work"`). | Met | ev:T-0664:c21d4948ff8d4806b61fc112 | manual repro against built CLI, recorded in Changes |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests (nextWork origin) | Yes | Passed | ev:T-0664:c21d4948ff8d4806b61fc112 |
| TypeScript build | Yes | Passed | ev:T-0664:3b325ef3c8f941b2bf0e3886 |
| Full test suite | Yes | Passed | ev:T-0664:ccd90916a8c841b98d58a663 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0663-.../DOGFOOD_REPORT.md` F-2 | background | active | Origin of this fix; independently reproduced outside the dogfood project. |
| `src/services/project-current-state.ts` | implementation-source | active | Owns `ProjectNextWork`/`hasBootstrapNextWork`/`inspectProjectCurrentStateSemantics`. |
| `src/init/adoption.ts` | implementation-source | active | Seeds the adoption-baseline bootstrap `nextWork`. |
| `src/task/task-selection.ts`, `src/context/session-start.ts` | implementation-source | active | The other two duplicated bootstrap-detection sites this capsule consolidates. |

## Changes

| Area | Summary |
|---|---|
| `src/services/project-current-state.ts` | `ProjectNextWorkOrigin` type and `origin` field on `ProjectNextWork`; `inferNextWorkOrigin()` (exported, used for back-compat inference); `hasBootstrapNextWork()` now checks `origin !== 'declared'` instead of title-matching the currently-completing task; `normalizeProjectCurrentState()` backfills `origin` for legacy `nextWork` on read; `validNextWork()` validates `origin`; `nextWorkFromLegacyIntent()` and `createInitialProjectCurrentState()` set `origin`; new `STATE_CURRENT_CANON_STALE_BOOTSTRAP_NEXT_WORK` advisory in `inspectProjectCurrentStateSemantics()`. |
| `src/init/adoption.ts` | Brownfield adoption seed sets `origin: 'bootstrap-adoption-baseline'`. |
| `src/task/task-selection.ts` | Removed `isBootstrapFirstTaskNextWork`/`isBootstrapAdoptionBaselineNextWork` (title-matching helpers); both call sites now check `nextWork.origin` directly. |
| `src/context/session-start.ts` | `scrubBootstrapNextWorkForSession` now checks `nextWork.origin !== 'declared'` instead of its own local title-matching copy (previously only recognized the first-task phrase, missing the adoption-baseline one entirely). |
| `src/schemas/project-current-state.schema.json` | `origin` added to `$defs/nextWork` required properties and enum. |
| `src/init/templates.ts`, `docs/HADARA_WORKFLOW.md` | F-1: added a PATH-precedence warning to the "Installed Package Fallback" section, recommending `hadara version --json` verification before delegating work. |
| `tests/unit/next-work-origin.test.ts` | 8 new tests: `inferNextWorkOrigin`, F-2's exact repro (retirement on an unrelated task closing) via both `completeProjectCurrentTask` and `planCompletedProjectCurrentStateWrites`, declared next work is not falsely retired, legacy back-compat normalization + schema validation, and the new advisory (positive and negative cases). |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | F-3 re-verified resolved: manual repro (brownfield adoption → unrelated feature task closes → `task status --json`) now shows `phase: "continuation-ready"` with the correct `create-continuation-task` action, not the stale `review-next-work` shadowing observed in T-0663. No separate precedence logic was needed. | Closed | tasks/T-0663-.../DOGFOOD_REPORT.md F-3 |
| RF-2 | Follow-up | `/mnt/f/NowWorking/dev/driftlog`'s already-corrupted `nextWork` (from the T-0663 dogfood) was not retroactively repaired; it will self-heal the next time any task closes there under this fixed binary, or an operator can manually clear it. | Open | External project, out of this repo's scope |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-20 | Draft | Initial task scaffold. |
| 2026-07-20 | Done | nextWork.origin consolidation implemented across 3 files, stale-bootstrap advisory added, F-1 docs warning added, F-3 re-verified resolved; 79 focused tests plus build and full suite (165 files / 1221 tests) passed. |
