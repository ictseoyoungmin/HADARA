# T-0489 0.4.0 stable readiness decision

## Identity

| Field | Value |
|---|---|
| ID | T-0489 |
| Title | 0.4.0 stable readiness decision |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Decide whether `hadara@0.4.0-rc.0` can proceed to stable publish preparation. | The decision must separate readiness to prepare stable publish from approval to publish. |

## Scope

| Boundary | Items |
|---|---|
| In | Review pre-stable capsules, npm rc/stable registry state, GitHub rc draft state, release gate output, and residual risks. |
| Out | Version bump, release artifact refresh, npm publish, GitHub stable release creation, and stable installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Review registry, GitHub draft, release gate, and pre-stable capsule audit inputs. | Done |
| 2 | Write a promote/no-promote stable readiness decision with residuals and next-capsule boundary. | Done |
| 3 | Update shared state docs and record validation evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The task records an explicit stable readiness decision. | Met | `ev:T-0489:a15c2fd8548c496593c2d31f` | `artifacts/STABLE_READINESS_DECISION.md` |
| AC-2 | The decision reviews required pre-stable capsules and release gates. | Met | `ev:T-0489:a15c2fd8548c496593c2d31f` | `artifacts/STABLE_READINESS_DECISION.md` |
| AC-3 | The decision preserves approval-gated publish boundaries and defines the next capsule. | Met | `ev:T-0489:a15c2fd8548c496593c2d31f` | `artifacts/STABLE_READINESS_DECISION.md` |
| AC-4 | Validation and shared state updates are recorded. | Met | `ev:T-0489:a15c2fd8548c496593c2d31f` | `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/TASK_BOARD.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm registry rc/stable state | Yes | Passed | `ev:T-0489:a15c2fd8548c496593c2d31f` |
| GitHub rc draft state | Yes | Passed | `ev:T-0489:a15c2fd8548c496593c2d31f` |
| Pre-stable capsule audit | Yes | Passed | `ev:T-0489:a15c2fd8548c496593c2d31f` |
| Strict release gate | Yes | Passed | `ev:T-0489:a15c2fd8548c496593c2d31f` |
| Harness done validation | Yes | Passed | `ev:T-0489:e8fa9fbb6c5b458bb4b35857` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` | constraint | implemented | Defines required pre-stable gates and stable execution capsules. |
| `docs/RELEASE_READINESS.md` | reference | implemented | Tracks release target and publish boundaries. |
| `docs/RELEASE_NOTES.md` | reference | implemented | Tracks current 0.4.0-rc.0 release notes. |
| `tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/artifacts/flowforge-mvp/reports/HADARA_DOGFOOD_REPORT.md` | reference | implemented | Original installed-package dogfood friction report. |
| `tasks/T-0481-task-capsule-human-readable-schema-cleanup` through `tasks/T-0488-0-4-0-rc-0-github-release-draft` | reference | implemented | Required pre-stable cleanup capsule evidence. |

## Changes

| Area | Summary |
|---|---|
| Release decision | Added the T-0489 stable readiness decision artifact. |
| Shared state | Updated release/current-state docs to route next work to stable publish preparation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Stable publish still requires a separate capsule that retargets source metadata to `0.4.0`, refreshes artifacts, reruns release validation, and performs approval-gated publish. | Open | `artifacts/STABLE_READINESS_DECISION.md` |
| RF-2 | Risk | T-0481 has a non-blocking post-close diagnostic report hash warning. | Accepted | `artifacts/STABLE_READINESS_DECISION.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Initial task scaffold. |
| 2026-07-03 | In Progress | Reviewed registry, GitHub draft, release gate, and pre-stable capsule audit inputs. |
| 2026-07-03 | Done | Stable readiness decision recorded; stable publish preparation is next. |
