# T-0625 0.4.6 rc1 current-package codex dogfood before stable

## Identity

| Field | Value |
|---|---|
| ID | T-0625 |
| Title | 0.4.6 rc1 current-package codex dogfood before stable |
| Status | Done |
| Created | 2026-07-16 |
| Updated | 2026-07-16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0625 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Verify whether the current source package is stable-promotion ready by installing it into fresh external projects and delegating realistic HADARA-driven work to Codex. | Use a local tarball from the current source state, not the already-published rc.1 registry artifact, so T-0624 fixes are included. |

## Scope

| Boundary | Items |
|---|---|
| In | Build/package current source into an installable tarball.<br>Create fresh external dogfood projects under `/mnt/f/NowWorking/dev`.<br>Install HADARA, run `hadara init`, and delegate ordinary user-style development to `codex exec`.<br>Inspect generated docs/tasks/evidence and decide whether 0.4.6 stable can proceed. |
| Out | Publishing npm/GitHub stable release.<br>Fixing unrelated HADARA-dev-only release helper issues unless they affect normal users.<br>Large product development beyond dogfood proof. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define current-package dogfood contract. | Done |
| 2 | Pack current source and install into a fresh external project. | Done |
| 3 | Delegate Codex scenario and inspect outputs. | Done |
| 4 | Record stable-promotion judgment and evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | External project installs the current source package and reports the intended HADARA version/entrypoint. | Done | DOGFOOD_REPORT.md | Local tarball |
| AC-2 | Delegated Codex attempts the generated HADARA lifecycle from init through first capsule close and the outcome is captured. | Done | ev:T-0625:610cfe0276f343c59033a04c | External dogfood project |
| AC-3 | Generated `docs/` and `tasks/` outputs are reviewed for blocker UX defects. | Done | ev:T-0625:2560fdd6cd9c4e21b784dc18 | Dogfood report |
| AC-4 | Stable-promotion recommendation is documented with pass/blocker/residual classification. | Done | ev:T-0625:2560fdd6cd9c4e21b784dc18 | Dogfood report |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Package tarball install smoke | Yes | Passed | ev:T-0625:2560fdd6cd9c4e21b784dc18 |
| Delegated Codex dogfood | Yes | Blocked | ev:T-0625:610cfe0276f343c59033a04c |
| Generated docs/task review | Yes | Passed | ev:T-0625:2560fdd6cd9c4e21b784dc18 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0623-0-4-6-rc1-installed-package-recycle-and-delegated-dogfood/DOGFOOD_REPORT.md` | reference | active | Previous delegated dogfood baseline. |
| `tasks/T-0624-0-4-6-rc1-delegated-dogfood-findings-cleanup/TASK.md` | reference | active | Fixes that must be included in this current-package dogfood. |
| `/mnt/f/NowWorking/dev` | constraint | active | External dogfood root outside HADARA-dev. |

## Changes

| Area | Summary |
|---|---|
| package dogfood | Packed current source into `/tmp/hadara-0.4.6-rc.1.tgz`, installed it under an external project-local `.hadara-install`, and initialized a governed project. |
| delegated agent run | Ran Codex CLI against `/mnt/f/NowWorking/dev/hadara-046rc1-current-codex-dogfood`; it reached a first-capsule close blocker and stopped before MVP implementation. |
| stable decision | Documented stable promotion as blocked until first-capsule close can complete without lifecycle-owned manual status edits. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Fix `task finalize --execute --auto` / partial close repair so first-user agents can close the baseline capsule without direct Task Board status edits. | Open | DOGFOOD_REPORT.md |
| RF-2 | Follow-up | Clarify generated docs and finalizer fix hints so lifecycle-owned status repair guidance is not contradictory. | Open | DOGFOOD_REPORT.md |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-16 | Draft | Initial task scaffold. |
| 2026-07-16 | In Progress | Scoped current source package Codex dogfood before stable promotion. |
| 2026-07-16 | Done | Current package dogfood found a stable blocker in first-capsule finalize/Task Board lifecycle ownership. |
