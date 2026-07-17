# T-0643 0.5.0 latest dist delegated Codex dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0643 |
| Title | 0.5.0 latest dist delegated Codex dogfood |
| Status | Done |
| Created | 2026-07-17T22:27 |
| Updated | 2026-07-17T22:42 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0643 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Dogfood the latest built `dist` package with a delegated Codex agent in a fresh external project. | Focus on 0.5.0 status/session-loop behavior, task-local Identity timestamps, lifecycle close flow, and generated docs guidance. |

## Scope

| Boundary | Items |
|---|---|
| In | Build latest `dist`, package current source, initialize a fresh external governed project under `/mnt/f/NowWorking/dev`, delegate a small MVP workflow to Codex, collect output/UX findings, and report stable/blocker status. |
| Out | Publishing, broad 0.5.x implementation, modifying the external project after delegated dogfood except for setup/install/init. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Prepare latest build/package and external dogfood project. | Done |
| 2 | Delegate workflow to Codex using generated HADARA docs and status guidance. | Done |
| 3 | Inspect resulting docs/tasks/output and classify findings. | Done |
| 4 | Record evidence and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Latest source `dist` is built and packaged for dogfood. | Met | ev:T-0643:93142efacb9c41f0af120eb1 | `npm run build`, `/tmp/hadara-0.4.6.tgz` |
| AC-2 | Fresh external project initializes successfully from the packaged candidate. | Met | ev:T-0643:93142efacb9c41f0af120eb1 | `/mnt/f/NowWorking/dev/hadara-050-latest-dist-codex-dogfood` |
| AC-3 | Delegated Codex uses HADARA workflow to complete at least one capsule or clearly reports a blocker. | Met | ev:T-0643:93142efacb9c41f0af120eb1 | `DOGFOOD_REPORT.md` |
| AC-4 | Findings are classified as stable blocker, follow-up, or accepted behavior. | Met | ev:T-0643:93142efacb9c41f0af120eb1 | `DOGFOOD_REPORT.md` |
| AC-5 | Validation evidence is recorded. | Met | ev:T-0643:93142efacb9c41f0af120eb1 | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run build` | Yes | Passed | ev:T-0643:93142efacb9c41f0af120eb1 |
| External candidate init/status/finalize dogfood | Yes | Passed | ev:T-0643:93142efacb9c41f0af120eb1 |
| Delegated Codex report review | Yes | Passed | ev:T-0643:93142efacb9c41f0af120eb1 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | requirement | active | Use latest built `dist` and Codex delegated dogfood to evaluate 0.5.0 changes. |
| T-0642 | reference | active | New task-local Identity timestamp behavior should be exercised. |

## Changes

| Area | Summary |
|---|---|
| Build/package | Built latest `dist` and packed the current source into `/tmp/hadara-0.4.6.tgz` for candidate install. |
| External dogfood | Installed the candidate in a fresh governed project and delegated T-0001/T-0002 work to Codex. |
| Report | Added `DOGFOOD_REPORT.md` and local feedback notes for follow-up UX issues. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Finalize dry-run should surface controlled-token blockers before execute. | Open | `.hadara/local/feedback/T-0643-finalize-dry-run-deferred-token-checks.md` |
| RF-2 | Follow-up | `project-state.update` is referenced as managed owner but not discoverable as a public command. | Open | `.hadara/local/feedback/T-0643-project-state-update-discoverability.md` |
| RF-3 | Follow-up | `status --json` still reports no validation baseline after adoption-baseline doctor evidence. | Open | `.hadara/local/feedback/T-0643-status-validation-baseline-stale.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-17 | Draft | Initial task scaffold. |
| 2026-07-17 | In Progress | Built latest dist and prepared delegated dogfood task scope. |
| 2026-07-17 | In Progress | Delegated Codex completed adoption and Quant Battle Arena MVP capsules; follow-up UX findings classified. |
| 2026-07-17 | Done | Recorded delegated dogfood report and validation evidence. |
