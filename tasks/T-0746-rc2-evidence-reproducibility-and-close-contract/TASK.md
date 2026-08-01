# T-0746 RC2 Evidence Reproducibility and Close Contract

## Identity

| Field | Value |
|---|---|
| ID | T-0746 |
| Title | RC2 Evidence Reproducibility and Close Contract |
| Status | Done |
| Created | 2026-08-01T23:55 |
| Updated | 2026-08-02T00:20 |

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
| 1 | Correct the Done-source fixture and add the T-0001 historical-reference negative case. | Done |
| 2 | Add the tracked installed lifecycle helper and structured result artifact. | Done |
| 3 | Move shared close primitives into model and add pre/post HANDOFF contract. | Done |
| 4 | Run focused/full validation, resolve evidence, and close through reviewed proof-last execution. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The Done-source regression uses the actual latest Done source, and a T-0001 historical reference remains actionable for a new task. | Done | ev:T-0746:59b3f8fb4ee64ef5bbba9134 | tests/unit/task-selection.test.ts; tests/unit/task-selection-continuation.test.ts |
| AC-2 | An executable tracked installed lifecycle helper emits the required structured result fields and its actual pass is recorded. | Done | ev:T-0746:258885859e774a67b7b960a4 | tools/dev-surface/installed-lifecycle-smoke.ts; artifacts/installed-lifecycle/result.json |
| AC-3 | The close model owns shared plan/report primitives without importing plan or proof modules. | Done | ev:T-0746:51c20a56c0644747a0c33a56 | src/task/close/model.ts |
| AC-4 | HANDOFF has distinct pre-close and post-close continuation sections; selection and close diagnostics use the post-close section after Done while retaining legacy fallback. | Done | ev:T-0746:ee9c789b06bb4faf8a7a3bf2 | src/task/task-selection.ts; src/task/close/proof.ts; src/task/handoff-sections.ts |
| AC-5 | Focused tests, full `npm run check`, package/consumer smoke, and close-plan readiness are complete for reviewed proof-last execution; execution must produce `closed-valid`. | Done | ev:T-0746:3e67d4a475db4724a6f022c0; ev:T-0746:abc691b4fded41f382ab13e5; ev:T-0746:258885859e774a67b7b960a4; ev:T-0746:ee9c789b06bb4faf8a7a3bf2 | task evidence and reviewed close plan |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Selection regression suite | Yes | Passed | exit 0 in 1966ms; latest Done source is the actual source row and the T-0001 historical reference remains actionable. | ev:T-0746:59b3f8fb4ee64ef5bbba9134 |
| Handoff phase contract | Yes | Passed | 5 files and 47 tests passed; canonical pre-close/post-close sections and legacy fallback are covered. | ev:T-0746:ee9c789b06bb4faf8a7a3bf2 |
| Close model import audit | Yes | Passed | Shared model types compile without plan/proof ownership cycle. | ev:T-0746:51c20a56c0644747a0c33a56 |
| Installed lifecycle smoke | Yes | Passed | Tracked helper, structured result, package consumer lifecycle. | ev:T-0746:258885859e774a67b7b960a4 |
| Init template contract | Yes | Passed | 34 tests passed; generated workflow text matches the canonical HANDOFF phase names. | ev:T-0746:4093fae038ad45c8ae45fcd3 |
| Full `npm run check` | Yes | Passed | Build, tools typecheck, public 129 files/1047 tests, and HADARA-dev 16 files/135 tests passed; previous failed evidence is resolved. | ev:T-0746:3e67d4a475db4724a6f022c0 |
| Package/core and consumer smoke | Yes | Passed | RC2 tarball installed into an isolated consumer project; package command surface, generated init docs, doctor, and cleanup passed. | ev:T-0746:abc691b4fded41f382ab13e5 |
| Reviewed close dry-run/execute/audit | Yes | Not Run | Execute only after reviewing the dry-run plan hash; close proof must reach `closed-valid`. | task close proof |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer findings for T-0745 | reference | active | Forward-fix all five findings; do not mutate the closed T-0745 source capsule. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Use `validation run`, reviewed `task close`, and task-local evidence. |
| `docs/RC2_CONTRACT_FREEZE.md` | constraint | active | RC2 remains frozen; this task only repairs contract integrity and evidence reproducibility. |

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

T-0746 makes the RC2 close contract reproducible and phase-specific. Done-task selection consumes the actual latest Done source, historical task references remain actionable, installed lifecycle acceptance is replayable from a tracked helper and result artifact, close model primitives are plan/proof-independent, and HANDOFF pre-close/post-close guidance is explicit. Historical T-0745 failed evidence is directly resolved by the current installed pass; no closed capsule was edited.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-01 | Draft | Initial task scaffold. |
| 2026-08-01 | Done | Implementation and validation are complete; the capsule is ready for reviewed proof-last close. |
