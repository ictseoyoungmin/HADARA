# T-0513 0.4.1 rc0 installed package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0513 |
| Title | 0.4.1 rc0 installed package recycle |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Verify the published `hadara@0.4.1-rc.0` package from consumer install paths. | Use installed-package recycle after npm/GitHub publication to prove the public package installs, reports the expected version, runs fresh-project workflow smokes, and does not depend on the source checkout. |

## Scope

| Boundary | Items |
|---|---|
| In | Registry metadata check, installed-package recycle using `hadara@next` / expected `0.4.1-rc.0`, evidence capture, and release-line state updates. |
| Out | npm publish, GitHub Release mutation, source release artifact regeneration, code changes, or stable promotion. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm public npm/GitHub publish evidence from T-0512. | Done |
| 2 | Run installed-package recycle from consumer install path. | Done |
| 3 | Record evidence and update shared state. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | npm registry metadata still resolves `hadara@0.4.1-rc.0` and `next=0.4.1-rc.0`. | Done | `ev:T-0513:ae53bafd8e564ba597b38975` | npm registry |
| AC-2 | Installed package recycle passes for `hadara@next` with expected version `0.4.1-rc.0`. | Done | `ev:T-0513:55abd88e46ce40d88a5942fb`, `ev:T-0513:43a25a83247d4823aad8475a` | `hadara package recycle` |
| AC-3 | Shared release-line docs identify installed-package recycle as complete and preserve stable `latest=0.4.0`. | Done | `ev:T-0513:55abd88e46ce40d88a5942fb`, `ev:T-0513:43a25a83247d4823aad8475a` | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/RELEASE_READINESS.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm registry metadata | Yes | Passed | ev:T-0513:ae53bafd8e564ba597b38975 |
| package recycle focused tests | Yes | Passed | ev:T-0513:5ee5be16ef224c38a0baa6ca |
| build | Yes | Passed | ev:T-0513:e885ae3e849243a2bb065fa9 |
| installed package recycle | Yes | Passed | ev:T-0513:43a25a83247d4823aad8475a |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0512 post-publish evidence | reference | active | npm and GitHub public release metadata are verified; recycle is next. |
| `docs/RELEASE_READINESS.md` | reference | active | Defines installed-package recycle command and no-publish boundary. |
| npm registry | reference | active | Public package source for installed consumer validation. |

## Changes

| Area | Summary |
|---|---|
| Release validation | `hadara@next` installed from npm as `0.4.1-rc.0`; installed CLI version/init/task status/session/finalize/context pack/context slice smokes passed in a disposable consumer workspace; stable `latest` remained `0.4.0`. |
| Package recycle helper | Replaced the stale installed smoke call to removed `task lifecycle` with `task status --task <task-id> --json`; focused tests and build passed. |
| Shared state | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, and `docs/RELEASE_READINESS.md` now identify `0.4.1-rc.0` as published and installed-package recycled while stable `latest` remains `0.4.0`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Decide whether `0.4.1-rc.0` warrants additional external dogfood beyond package recycle before any stable `0.4.1` decision. | Open | Future capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Installed-package recycle scope defined after npm/GitHub publication. |
| 2026-07-08 | In Progress | Installed-package recycle passed after fixing stale package recycle helper command usage. |
| 2026-07-08 | Done | Shared release-line docs updated; residual failed recycle attempts resolved by passing recycle evidence. |
