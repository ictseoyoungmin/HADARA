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
| 2 | Recreate the reusable `hadara-dev` Docker container from a freshly pulled image. | Done |
| 3 | Run Docker-based source build/check and release-readiness recycle commands from clean ext4 paths where required. | Done |
| 4 | Remove tracked rc.0/rc.1 release document drift and align current-state handoff/projections. | Done |
| 5 | Record validation evidence, summarize residuals, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The reusable Docker validation environment is recreated from a freshly pulled Node 22 image and `hadara-dev` runs against `/workspace`. | Met | `ev:T-0667:17932d8a4a684db18a62dbe8` | `docs/HADARA_WORKFLOW.md`, `docs/TEST_STRATEGY.md` |
| AC-2 | `0.5.0-rc.1` package smoke, clean-checkout smoke, release artifact evidence, strict release gate, release dry-run, and publish dry-run/readiness checks are refreshed or any blocker is recorded honestly. | Met | `ev:T-0667:87eb2cd5efa747458b8e749f`, `ev:T-0667:d533bf36c9e74741a12398f3`, `ev:T-0667:e2c5104a4bfc4df6abb0300c`, `ev:T-0667:17932d8a4a684db18a62dbe8` | `docs/RELEASE_READINESS.md` |
| AC-3 | Tracked current release/readiness docs do not claim stale rc.0 readiness as current rc.1 readiness. | Met | `ev:T-0667:17932d8a4a684db18a62dbe8` | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/RELEASE_READINESS.md`, `docs/RELEASE_NOTES.md`, `README.md` |
| AC-4 | No publish/deploy mutation is executed. | Met | `ev:T-0667:17932d8a4a684db18a62dbe8` | `docs/RELEASE_READINESS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Fresh Docker container recreation | Yes | Passed | `ev:T-0667:17932d8a4a684db18a62dbe8` |
| Docker build/check validation | Yes | Passed | `ev:T-0667:17932d8a4a684db18a62dbe8` |
| Package smoke for `0.5.0-rc.1` | Yes | Passed | `ev:T-0667:87eb2cd5efa747458b8e749f` |
| Clean-checkout smoke for `0.5.0-rc.1` | Yes | Passed | `ev:T-0667:d533bf36c9e74741a12398f3` |
| Release artifact with attached evidence | Yes | Passed | `ev:T-0667:e2c5104a4bfc4df6abb0300c` |
| Strict release gate | Yes | Passed | `ev:T-0667:17932d8a4a684db18a62dbe8` |
| Release dry-run | Yes | Passed | `ev:T-0667:17932d8a4a684db18a62dbe8` |
| Release publish dry-run/readiness report | Yes | Passed with token warnings only | `ev:T-0667:17932d8a4a684db18a62dbe8` |
| Documentation drift scan | Yes | Passed | `ev:T-0667:17932d8a4a684db18a62dbe8` |

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
| Docker validation | Pulled `node:22-bookworm` digest `sha256:5647be709086c696ff32edaaf1c70cd26d1da6ab2b39c32f3c7b4c4a31957e37`, recreated `hadara-dev`, and refreshed `dist` with Docker sync-build. |
| Release evidence | Refreshed package smoke, clean-checkout smoke, release artifact, strict release gate, release dry-run, publish dry-run, npm registry read-only verification, and docs doctor evidence for `0.5.0-rc.1`. |
| Documentation | Updated stale rc.0/current release wording in release/current-state docs and README badge/status surfaces. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Residual | Actual npm/GitHub publication remains a separate approval-gated operator mutation after recycle evidence is green. | Open | `docs/RELEASE_READINESS.md` |
| RF-2 | Residual | Package smoke's installed core smoke needs `--timeout 300` in this large HADARA-dev workspace; the default 120s timeout failed twice before the 300s rerun passed. | Watch | `ev:T-0667:17932d8a4a684db18a62dbe8` |
| RF-3 | Residual | Release artifact should run from a clean ext4 clone because `/workspace` contained untracked `.claude/` state and failed the artifact dirty-worktree preflight. | Watch | `ev:T-0667:17932d8a4a684db18a62dbe8` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-21 | Draft | Initial task scaffold. |
| 2026-07-21 | In Progress | Defined release-readiness recycle scope and validation gates. |
| 2026-07-21 | Done | Recycled rc.1 release readiness evidence, resolved failed attempts, updated release docs, and prepared for task close. |
