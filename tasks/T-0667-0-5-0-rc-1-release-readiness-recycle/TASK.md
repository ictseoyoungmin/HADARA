# T-0667 0.5.0-rc.1 release-readiness recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0667 |
| Title | 0.5.0-rc.1 release-readiness recycle |
| Status | Draft |
| Created | 2026-07-21T19:57 |
| Updated | 2026-07-21T19:57 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0667 --json`.

## Goal

| Goal | Notes |
|---|---|
| Recycle `0.5.0-rc.1` release readiness evidence and remove release-document drift before any publish decision. | Use a freshly pulled Docker image and newly recreated `hadara-dev` container; do not publish npm, create GitHub Releases, build/push Docker release images, or mutate registries. |

## Scope

| Boundary | Items |
|---|---|
| In | Fresh Docker dev container setup, Docker-based build/check/release readiness commands, package smoke, clean-checkout smoke, release artifact evidence, strict release gate, release dry-run, publish dry-run/readiness report if available, npm registry read-only verification, and tracked release/current-state documentation drift cleanup. |
| Out | `npm publish`, GitHub Release creation/publication, Docker release image build/push, token loading, installer execution, or broad feature work unrelated to release readiness. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the release-readiness recycle task contract and source constraints. | Done |
| 2 | Recreate the reusable `hadara-dev` Docker container from a freshly pulled image. | Pending |
| 3 | Run Docker-based source build/check and release-readiness recycle commands from clean ext4 paths where required. | Pending |
| 4 | Remove tracked rc.0/rc.1 release document drift and align current-state handoff/projections. | Pending |
| 5 | Record validation evidence, summarize residuals, and close the capsule. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The reusable Docker validation environment is recreated from a freshly pulled Node 22 image and `hadara-dev` runs against `/workspace`. | Pending | TBD | `docs/HADARA_WORKFLOW.md`, `docs/TEST_STRATEGY.md` |
| AC-2 | `0.5.0-rc.1` package smoke, clean-checkout smoke, release artifact evidence, strict release gate, release dry-run, and publish dry-run/readiness checks are refreshed or any blocker is recorded honestly. | Pending | TBD | `docs/RELEASE_READINESS.md` |
| AC-3 | Tracked current release/readiness docs do not claim stale rc.0 readiness as current rc.1 readiness. | Pending | TBD | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/RELEASE_READINESS.md`, `docs/RELEASE_NOTES.md`, `README.md` |
| AC-4 | No publish/deploy mutation is executed. | Pending | TBD | `docs/RELEASE_READINESS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Fresh Docker container recreation | Yes | Not Run | TBD |
| Docker build/check validation | Yes | Not Run | TBD |
| Package smoke for `0.5.0-rc.1` | Yes | Not Run | TBD |
| Clean-checkout smoke for `0.5.0-rc.1` | Yes | Not Run | TBD |
| Release artifact with attached evidence | Yes | Not Run | TBD |
| Strict release gate | Yes | Not Run | TBD |
| Release dry-run | Yes | Not Run | TBD |
| Release publish dry-run/readiness report | Yes | Not Run | TBD |
| Documentation drift scan | Yes | Not Run | TBD |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/state/current.json` | current-state | active | Canonical release, latest task, active task, continuation, known problems, validation baseline. |
| `docs/HADARA_WORKFLOW.md` | workflow | active | Docker workflow and task lifecycle routing. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | workflow | active | Task creation/evidence/close write boundaries. |
| `docs/RELEASE_READINESS.md` | release-readiness | active | Current release evidence and publish boundary source. |
| `docs/TEST_STRATEGY.md` | validation | active | Docker dev container command pattern. |
| `docs/PROJECT_STATE.md` | current-state projection | active | Needs stale prose cleanup if it still describes rc.0 as current. |
| `docs/AGENT_HANDOFF.md` | handoff projection | active | Must be updated before stopping. |

## Changes

| Area | Summary |
|---|---|
| N/A | No implementation or documentation changes yet beyond this task contract. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Residual | Actual npm/GitHub publication remains a separate approval-gated operator mutation after recycle evidence is green. | Open | `docs/RELEASE_READINESS.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-21 | Draft | Initial task scaffold. |
| 2026-07-21 | In Progress | Defined release-readiness recycle scope and validation gates. |
