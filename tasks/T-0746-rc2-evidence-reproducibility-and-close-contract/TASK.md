# T-0746 RC2 Evidence Reproducibility and Close Contract

## Identity

| Field | Value |
|---|---|
| ID | T-0746 |
| Title | RC2 Evidence Reproducibility and Close Contract |
| Status | Draft |
| Created | 2026-08-01T23:55 |
| Updated | 2026-08-01T23:55 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make the RC2 close contract reproducible and structurally unambiguous. | Fix the Done-source regression fixture, preserve historical-reference task selection, track an installed lifecycle smoke helper with structured output, remove close model dependencies on plan/proof modules, and separate pre-close action from post-close continuation. |

## Scope

| Boundary | Items |
|---|---|
| In | Selection regression tests, tracked installed lifecycle smoke, evidence resolution clarity, close model type ownership, HANDOFF/template/parser contract, focused and full validation. |
| Out | Editing the already closed T-0745 capsule, npm publish, remote CI, broad close-module decomposition beyond the reported dependency boundary. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Correct the Done-source fixture and add the T-0001 historical-reference negative case. | In Progress |
| 2 | Add the tracked installed lifecycle helper and structured result artifact. | Pending |
| 3 | Move shared close primitives into model and add pre/post HANDOFF contract. | Pending |
| 4 | Run focused/full validation, resolve evidence, and close through reviewed proof-last execution. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The Done-source regression uses the actual latest Done source, and a T-0001 historical reference remains actionable for a new task. | Pending | TBD | tests/unit/task-selection.test.ts |
| AC-2 | An executable tracked installed lifecycle helper emits the required structured result fields and its actual pass is recorded. | Pending | TBD | tools/dev-surface/installed-lifecycle-smoke.ts |
| AC-3 | The close model owns shared plan/report primitives without importing plan or proof modules. | Pending | TBD | src/task/close/model.ts |
| AC-4 | HANDOFF has distinct pre-close and post-close continuation sections; selection and close diagnostics use the post-close section after Done while retaining legacy fallback. | Pending | TBD | src/task/task-selection.ts; src/task/close/proof.ts |
| AC-5 | Focused tests, full `npm run check`, package/consumer smoke, and reviewed close complete with `closed-valid`. | Pending | TBD | task evidence and close proof |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Selection regression suite | Yes | Not Run | Source/target ordering and historical reference negative case. | TBD |
| Close model import audit and focused close tests | Yes | Not Run | Shared model types compile without plan/proof ownership cycle. | TBD |
| Installed lifecycle smoke | Yes | Not Run | Tracked helper, structured result, package consumer lifecycle. | TBD |
| Full `npm run check` | Yes | Not Run | Build, typecheck, public and HADARA-dev tests. | TBD |
| Package/core and consumer smoke | Yes | Not Run | Installed package command surface and clean consumer project. | TBD |
| Reviewed close dry-run/execute/audit | Yes | Not Run | Proof-last close reaches `closed-valid`. | TBD |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer findings for T-0745 | requirement | active | Forward-fix all five findings; do not mutate the closed T-0745 source capsule. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | contract | active | Use `validation run`, reviewed `task close`, and task-local evidence. |
| `docs/RC2_CONTRACT_FREEZE.md` | release-boundary | active | RC2 remains frozen; this task only repairs contract integrity and evidence reproducibility. |

## Changes

| Area | Summary |
|---|---|
| Selection | Corrected Done-source fixture and historical-reference negative regression. |
| Validation | Tracked installed lifecycle smoke with versioned structured result output and direct resolution tags. |
| Close types | Shared primitives/report contracts owned by `close/model.ts`; plan/proof depend on model. |
| Handoff contract | Added pre-close operator action and post-close continuation structure with legacy reader fallback. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Deeper close planner/executor file decomposition remains a post-RC2 milestone. | Deferred | docs/ROADMAP.md |

## Close Summary

Pre-close operator action and post-close continuation are recorded in the task-local HANDOFF. This summary will contain only the completed outcome before proof-last close; it will not describe close execution as pending.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-01 | Draft | Initial task scaffold. |
