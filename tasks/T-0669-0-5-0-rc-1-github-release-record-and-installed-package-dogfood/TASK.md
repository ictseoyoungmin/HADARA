# T-0669 0.5.0-rc.1 GitHub release record and installed-package dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0669 |
| Title | 0.5.0-rc.1 GitHub release record and installed-package dogfood |
| Status | Done |
| Created | 2026-07-21T21:33 |
| Updated | 2026-07-21T21:41 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0669 --json`.

## Goal

| Goal | Notes |
|---|---|
| Record the operator-completed `v0.5.0-rc.1` GitHub Release publication, verify public npm/GitHub release state, and rerun installed-package dogfood from `hadara@next` in Docker. | This capsule extends T-0668 after the external GitHub Release mutation completed. It uses the newly installed public package, not the source workspace CLI, for consumer-path checks. |

## Scope

| Boundary | Items |
|---|---|
| In | Operator-provided npm/GitHub release log; workspace npm/GitHub public-state verification; Docker `hadara-dev` npm install of `hadara@next`; fresh `basic`, `standard`, and `governed` init/status/task/context/docs smokes; installed `package recycle --execute`; README/release/current-state drift cleanup. |
| Out | npm publish, creating/editing GitHub releases, token loading, full delegated toy application implementation, Docker image publishing, or fixing the broader release workflow design defects. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Record operator-completed npm/GitHub publication and verify public state. | Done |
| 3 | Install `hadara@next` inside Docker and run multi-profile consumer-path dogfood. | Done |
| 4 | Update release docs/current-state projections and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Workspace evidence records both completed external publication facts: npm `hadara@0.5.0-rc.1` and GitHub Release `v0.5.0-rc.1`. | Done | ev:T-0669:9d08f787f7d64d85ad72c1b3 | operator log |
| AC-2 | Public state is independently verified: npm dist-tags and GitHub release URL are observable. | Done | ev:T-0669:374d423870f14757ada477b2 | npm; GitHub |
| AC-3 | Docker installed-package dogfood installs public `hadara@next`, verifies `0.5.0-rc.1`, and passes fresh profile smokes plus package recycle. | Done | ev:T-0669:39c8691d556943e68141f1fa | DOGFOOD_REPORT.md |
| AC-4 | Initial dogfood harness failure is recorded and resolved rather than hidden. | Done | ev:T-0669:92db1f03c50a4c369243c453 | EVIDENCE.md |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm/GitHub public-state verification | Yes | Passed | ev:T-0669:374d423870f14757ada477b2 |
| Docker installed-package dogfood | Yes | Passed | ev:T-0669:39c8691d556943e68141f1fa |
| First harness failure resolution | Yes | Passed | ev:T-0669:92db1f03c50a4c369243c453 |
| docs doctor | Yes | Passed | ev:T-0669:9bb85237a11344139325cc60 |
| task close | Yes | Passed | ev:T-0669:e1422f1a5e4a4bf8a241975b |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0668 | reference | active | Recorded npm publish, release-note artifact, and first installed-package recycle before GitHub Release publication. |
| Operator release log | reference | active | Shows `gh release create` returned an untagged draft URL and `gh release edit` returned `v0.5.0-rc.1`; npm publish output verified `hadara@0.5.0-rc.1`. |
| T-0615 | reference | active | Prior installed-package multi-scenario dogfood pattern. |
| Docker `hadara-dev` | reference | active | `node:22-bookworm` container used for npm install and consumer-path validation. |

## Changes

| Area | Summary |
|---|---|
| Release record | npm and GitHub Release publication are both recorded for `0.5.0-rc.1`. |
| Installed dogfood | Public `hadara@next` installs as `0.5.0-rc.1`; basic/standard/governed fresh profile smokes and package recycle passed in Docker. |
| Harness artifact | Added `run-installed-dogfood.sh` as the exact consumer-path dogfood command used for this capsule. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | The release workflow still needs a design-fix capsule so publish preparation produces GitHub Release note artifacts by construction instead of printing paths that may not exist. | Open | T-0668/T-0669 |
| RF-2 | Follow-up | This capsule did not run a full delegated toy application build; it intentionally ran bounded installed-package profile smokes and package recycle. | Open | DOGFOOD_REPORT.md |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-21 | Draft | Initial task scaffold. |
| 2026-07-21 | In Progress | Recorded npm/GitHub release publication, verified public state, and passed Docker installed-package dogfood after fixing the harness cwd assumption. |
| 2026-07-21 | Done | Completed release record, public-state verification, Docker installed-package dogfood, docs drift cleanup, and close preparation. |
