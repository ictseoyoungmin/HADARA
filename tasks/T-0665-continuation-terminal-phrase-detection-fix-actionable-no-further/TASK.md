# T-0665 Continuation terminal-phrase detection: fix actionable/no-further-work contradiction

## Identity

| Field | Value |
|---|---|
| ID | T-0665 |
| Title | Continuation terminal-phrase detection: fix actionable/no-further-work contradiction |
| Status | Done |
| Created | 2026-07-20T20:11 |
| Updated | 2026-07-20T23:11 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0665 --json`.

## Goal

| Goal | Notes |
|---|---|
| Fix a semantic contradiction found by operator review after the second driftlog dogfood run: `continuationFromTaskHandoffStep()` always defaults to `disposition: 'actionable'`/`createCommandAllowed: true` for any non-placeholder HANDOFF "Next Recommended Step", including steps that explicitly say no further work is queued. `task-selection-status-v2.ts` then offers `hadara task create '<that exact "no further work" sentence>'` as the primary next action — the opposite of what a deterministic, agent-readable status API should do. Also bump the package version to `0.5.0-rc.1` per operator decision, since further fixes are landing on top of the `0.5.0-rc.0` npm-published version and local pack/install tarballs must not be confused with it. | This is exactly T-0661's own documented RF-1 ("HANDOFF prose classification into waiting-for-operator/blocked is deferred") reproducing in practice, one step further: a "no work" statement isn't just mis-classified as `waiting-for-operator`, it is actively offered as a create-task command. |

## Scope

| Boundary | Items |
|---|---|
| In | Pattern-based terminal-phrase detection in `continuationFromTaskHandoffStep()`: a HANDOFF step matching a negation-of-work signal (`no further/more/additional/remaining/next/follow-up` co-occurring with `work/task/step/item/queued/pending/remaining/required`), or `nothing else/further/more is pending/queued/remaining`, or `all ... complete/done/finished/implemented`) is classified as `disposition: 'terminal'` with `createCommandAllowed: false` instead of `'actionable'`/`true`. `disposition: 'terminal'` already falls through to `idle` in `task-selection-status-v2.ts` (T-0661's documented MVP scope), so no changes were needed there. `package.json`/`package-lock.json` version bump to `0.5.0-rc.1`, with `docs/RELEASE_NOTES.md` (new `## 0.5.0-rc.1` section), `docs/RELEASE_READINESS.md`, and `README.md` updated to match — including correcting an initial wrong assumption that `0.5.0-rc.0` was never published (npm registry data supplied mid-task showed it was published to `next` 2 days prior). Regression tests for the reported sentence, several phrasings, and confirming normal actionable steps are unaffected. |
| Out | Full NLP/LLM-based classification of HANDOFF prose; classifying `waiting-for-operator`/`blocked` (still deferred per T-0661 RF-1, unchanged); retroactively fixing `driftlog`'s already-recorded "No further work..." continuation (external project, self-heals on next task close there); the validation baseline promotion and release-readiness recycle beyond the version/doc bump (tracked as T-0666). |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Add terminal-phrase pattern detection to `continuationFromTaskHandoffStep()`. | Done |
| 2 | Bump `package.json`/`package-lock.json` version to `0.5.0-rc.1`; update `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, `README.md`. | Done |
| 3 | Correct the "never published" assumption in those docs after npm registry data showed `0.5.0-rc.0` was published. | Done |
| 4 | Add regression tests (the exact reported sentence, similar phrasings, and confirm normal actionable steps are unaffected). | Done |
| 5 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `continuationFromTaskHandoffStep({ step: "No further work is queued from this dogfood/fix cycle." })` returns `disposition: 'terminal'`, `createCommandAllowed: false`. | Met | ev:T-0665:5e86d2ca20fe46c48cf4181a | src/services/project-current-state.ts |
| AC-2 | A `terminal`-disposition continuation never produces a `create-continuation-task` action in `task-selection-status-v2.ts` (falls through to `idle`, matching T-0661's existing documented scope). | Met | ev:T-0665:5e86d2ca20fe46c48cf4181a | tests/unit/task-selection-continuation.test.ts (pre-existing T-0661 coverage) |
| AC-3 | Ordinary actionable HANDOFF steps (e.g. "Create a new task to implement the second milestone...") are unaffected — no false-positive terminal classification. | Met | ev:T-0665:5e86d2ca20fe46c48cf4181a | tests/unit/continuation-terminal-detection.test.ts |
| AC-4 | `package.json` version is `0.5.0-rc.1`; build and full suite still pass with the bumped version. | Met | ev:T-0665:527eded82980411281445c9a | package.json, build + full suite |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests (continuation terminal detection) | Yes | Passed | ev:T-0665:5e86d2ca20fe46c48cf4181a |
| TypeScript build | Yes | Passed | ev:T-0665:fe4c2f26ee5a4c668619f29f |
| Full test suite | Yes | Passed | ev:T-0665:527eded82980411281445c9a |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Operator review after second driftlog dogfood run | requirement | active | Reported the exact contradiction and recommended a minimal pattern-based fix before 0.5.0 stable, plus the `0.5.0-rc.1` version bump decision. |
| `src/services/project-current-state.ts` `continuationFromTaskHandoffStep` | implementation-source | active | T-0661's promotion helper; owns the disposition default this capsule narrows. |
| `tasks/T-0661-.../TASK.md` RF-1 | background | active | Documents this as a known, deferred limitation; this capsule closes the specific "no further work" instance of it. |

## Changes

| Area | Summary |
|---|---|
| `src/services/project-current-state.ts` | `isTerminalStep()` and its patterns; `continuationFromTaskHandoffStep()` now classifies a matching HANDOFF step as `disposition: 'terminal'`, `createCommandAllowed: false` instead of always `'actionable'`/`true`. |
| `package.json`, `package-lock.json` | Version `0.5.0-rc.0` → `0.5.0-rc.1`. |
| `docs/RELEASE_NOTES.md` | New `## 0.5.0-rc.1` section summarizing T-0658-T-0665; corrected to state `0.5.0-rc.0` was published to `next` (not "never published" as first drafted). |
| `docs/RELEASE_READINESS.md` | New status line for the `0.5.0-rc.1` line; current-version/target lines bumped to `0.5.0-rc.1`; corrected the same "never published" mistake. |
| `README.md` | Release Status table updated for `0.5.0-rc.1`, correctly noting `0.5.0-rc.0` is published on `next`. |
| `tests/unit/continuation-terminal-detection.test.ts` | 5 new tests: the exact reported sentence, driftlog's real observed sentence, four other negation-of-work phrasings, four ordinary actionable steps (no false positives), and placeholder handling unchanged. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Pattern matching is English-phrasing-specific and will miss other terminal phrasings (including non-English ones); `waiting-for-operator`/`blocked` classification remains deferred per T-0661 RF-1. | Open | Future continuation-classification capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-20 | Draft | Initial task scaffold. |
| 2026-07-20 | Done | Terminal-phrase detection implemented, version bumped to 0.5.0-rc.1 with corrected release docs; 26 focused tests plus build and full suite (166 files, 1226 tests, 1 test file flaked under parallel contention but passed cleanly in isolation) passed. |
