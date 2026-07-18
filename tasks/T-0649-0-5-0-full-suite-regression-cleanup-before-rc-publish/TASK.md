# T-0649 0.5.0 full-suite regression cleanup before rc publish

## Identity

| Field | Value |
|---|---|
| ID | T-0649 |
| Title | 0.5.0 full-suite regression cleanup before rc publish |
| Status | Done |
| Created | 2026-07-18T19:03 |
| Updated | 2026-07-18T19:15 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0649 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Make the full test suite pass after the 0.5.0 status/HANDOFF identity changes exposed stale test expectations and one blocked-evidence semantics gap. | Keep changes limited to the failing regression set from the release-prep full-suite run. |

## Scope

| Boundary | Items |
|---|---|
| In | Update stale tests for status v2, timestamped Identity fields, HANDOFF Identity, and finish write counts; tighten blocked-evidence documentation semantics. |
| Out | New 0.5 features, release publication, broad evidence vocabulary changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reproduce and classify the six full-suite failures. | Done |
| 2 | Update stale tests and blocked-evidence semantics. | Done |
| 3 | Validate focused regression files, build, and full npm test suite. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The six reported full-suite failures are fixed or intentionally reclassified against the 0.5 contract. | Done | ev:T-0649:fcf5b2c078474cbdaf589a14 | Failing test list from attached log |
| AC-2 | Done tasks with blocked evidence require record-specific blocked/residual documentation before the blocked evidence is treated as explained. | Done | ev:T-0649:fcf5b2c078474cbdaf589a14 | `src/evidence/semantics.ts` |
| AC-3 | TypeScript build passes after the regression cleanup. | Done | ev:T-0649:15c4217a525c43a18144f4af | `npm run build` |
| AC-4 | Full npm test suite passes before 0.5.0-rc.0 publication proceeds. | Done | ev:T-0649:a304c064cb734dbfb8d19ba8 | `timeout 300 npm test` |
| AC-5 | Release readiness docs and GitHub Release note artifact include the post-T-0648 full-suite cleanup before publish. | Done | ev:T-0649:fea4ab66d9744473aa6877d9 | `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, `GITHUB_RELEASE_NOTE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused regression tests from full-suite failure | Yes | Passed | ev:T-0649:fcf5b2c078474cbdaf589a14 |
| TypeScript build after regression cleanup | Yes | Passed | ev:T-0649:15c4217a525c43a18144f4af |
| Full npm test suite | Yes | Passed | ev:T-0649:a304c064cb734dbfb8d19ba8 |
| Strict release gate after full-suite cleanup | Yes | Passed | ev:T-0649:fea4ab66d9744473aa6877d9 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Attached full-suite failure log | reference | active | Six failing tests from broader validation after T-0648. |
| `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md` | reference | active | 0.5 status v2 and session-start removal contract. |

## Changes

| Area | Summary |
|---|---|
| Status tests | Updated dogfood E2E fixture to expect default selected-task status v2. |
| Task scaffold tests | Updated timestamp and HANDOFF Identity expectations for `YYYY-MM-DDTHH:mm` fields. |
| Task finish tests | Updated finish write expectations for TASK.md, HANDOFF.md, and Task Board synchronization. |
| Evidence semantics | Require blocked evidence documentation to mention the specific evidence record or summary before suppressing unexplained-blocked errors. |
| Release docs | Added T-0649 full-suite cleanup notes and a refreshed GitHub Release note artifact for 0.5.0-rc.0 publication. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `validation run` timed out at 120s for the full mounted suite even though direct `timeout 300 npm test` passed. | Open | `.hadara/local/feedback/T-0649-validation-wrapper-timeout-for-full-suite.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | In Progress | Fixed stale full-suite expectations and blocked-evidence semantics; full direct npm test passed. |
| 2026-07-18 | Done | Full-suite regression cleanup complete before 0.5.0-rc.0 publish. |
