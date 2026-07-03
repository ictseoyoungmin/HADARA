# T-0492 stable 0.4.0 installed-package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0492 |
| Title | stable 0.4.0 installed-package recycle |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Verify published stable `hadara@0.4.0` from installed consumer paths. | Use a fresh unmounted container and the installed package's own recycle command. |

## Scope

| Boundary | Items |
|---|---|
| In | Fresh unmounted container install of `hadara@0.4.0`, installed CLI version check, installed-package recycle smoke, registry/package verification, evidence recording, and shared release-state updates. |
| Out | npm publish mutation, GitHub Release publication, source code changes, Docker image publish, PyPI publish, or installer execution. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define stable recycle scope and validation commands. | Done |
| 2 | Run fresh unmounted container install and recycle validation. | Done |
| 3 | Record evidence, update shared release state, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh unmounted container installs `hadara@0.4.0` globally. | Met | `ev:T-0492:50c4c3dc78a14861a165ad51` | `npm install -g hadara@0.4.0` |
| AC-2 | Installed CLI reports stable package version `0.4.0`. | Met | `ev:T-0492:50c4c3dc78a14861a165ad51` | `hadara version --json` |
| AC-3 | Installed-package recycle passes against `hadara@latest` with expected version `0.4.0`. | Met | `ev:T-0492:50c4c3dc78a14861a165ad51` | `hadara package recycle --execute --package hadara@latest --expected-version 0.4.0 --json` |
| AC-4 | Validation evidence is recorded in the task capsule. | Met | `ev:T-0492:c5320beb448d46dcacfebf48` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Fresh unmounted container install/version/recycle | Yes | Passed | `ev:T-0492:50c4c3dc78a14861a165ad51` |
| Harness done validation | Yes | Passed | `ev:T-0492:c5320beb448d46dcacfebf48` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` | constraint | implemented | Stable publish and GitHub draft are complete; stable recycle is the remaining execution capsule. |
| `docs/RELEASE_READINESS.md` | reference | implemented | Standard post-publish recycle command and boundaries. |
| npm registry | reference | implemented | Stable `hadara@0.4.0` is published on `latest`. |

## Changes

| Area | Summary |
|---|---|
| Package verification | Fresh unmounted `node:22-bookworm` container installed `hadara@0.4.0`, verified installed version `0.4.0`, and passed installed-package recycle against `hadara@latest`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Publish the GitHub stable draft only after operator review. | Open | `https://github.com/ictseoyoungmin/HADARA/releases` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Initial task scaffold. |
| 2026-07-03 | In Progress | Scoped stable installed-package recycle after npm publish and GitHub draft completion. |
| 2026-07-03 | Done | Fresh unmounted container recycle passed for stable `hadara@0.4.0`. |
