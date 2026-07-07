# T-0504 0.4.1 rc0 finalize readiness evidence UX

## Identity

| Field | Value |
|---|---|
| ID | T-0504 |
| Title | 0.4.1 rc0 finalize readiness evidence UX |
| Status | Done |
| Created | 2026-07-07 |
| Updated | 2026-07-07 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Reduce the routine close loop so clean capsules can rely on `task finalize --execute --auto` without separately running `validation run -- ... harness validate` just to record readiness evidence. | Keep `harness validate` as a diagnostic surface for blocker debugging, not a default human/agent loop step. |

## Scope

| Boundary | Items |
|---|---|
| In | `task finalize --execute --auto` readiness evidence behavior, command/report metadata, focused tests, workflow docs/init guidance, T-0504 evidence/finalize. |
| Out | Removing `harness validate`, changing `validation run` as the general command evidence wrapper, release publish/smoke mutation, broad command portfolio cleanup. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and current overlap between `harness validate`, `validation run`, and `task finalize`. | Done |
| 2 | Make auto finalize append idempotent validation-category readiness evidence only when a close evidence append is still required. | Done |
| 3 | Expose the readiness evidence in finalize JSON and keep closed-valid re-finalize read-only/idempotent. | Done |
| 4 | Update current/generated workflow guidance so `harness validate` is advanced debugging, not a required default loop step. | Done |
| 5 | Validate with focused tests, build, built CLI smoke, and done-level harness. | Done |
| 6 | Update shared state docs and finalize T-0504. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task finalize --execute --auto` on a clean not-yet-closed capsule records validation-category readiness evidence and then close evidence, so agents do not need a separate `validation run -- harness validate` for the done-level readiness proof. | Met | `ev:T-0504:76a66b51ccd3435a8875f5a1`, `ev:T-0504:da758ce735d74a35802f3081` | `src/task/task-finalize.ts` |
| AC-2 | Re-running finalize on an already `closed-valid` capsule does not append new readiness evidence or make the close proof stale. | Met | `ev:T-0504:76a66b51ccd3435a8875f5a1`, `ev:T-0504:da758ce735d74a35802f3081` | `src/task/task-finalize.ts` |
| AC-3 | The finalize JSON report exposes any readiness evidence append/no-op metadata in a stable additive field. | Met | `ev:T-0504:76a66b51ccd3435a8875f5a1`, `ev:T-0504:da758ce735d74a35802f3081` | `src/schemas/task-finalize.schema.json` |
| AC-4 | Workflow/help/generated-init docs present `harness validate` as advanced diagnostics and make `finalize --execute --auto` the normal close path after real validation. | Met | `ev:T-0504:76a66b51ccd3435a8875f5a1`, `ev:T-0504:c9be4fcc59dc49e1869b8a70` | `docs/TASK_WORKFLOW_COMMANDS.md` |
| AC-5 | Validation evidence is recorded and the task closes `closed-valid`. | Met | `ev:T-0504:2b115e53d3c04d89914afb0d` | T-0504 |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused task-finalize/readiness evidence tests | Yes | Passed | `ev:T-0504:76a66b51ccd3435a8875f5a1`, `ev:T-0504:c9be4fcc59dc49e1869b8a70` |
| TypeScript build | Yes | Passed | `ev:T-0504:76a66b51ccd3435a8875f5a1`, `ev:T-0504:c9be4fcc59dc49e1869b8a70` |
| Built CLI finalize readiness evidence smoke | Yes | Passed | `ev:T-0504:da758ce735d74a35802f3081` |
| Harness validate T-0504 | Yes | Passed | `ev:T-0504:2b115e53d3c04d89914afb0d` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `src/task/task-finalize.ts` | reference | approved | Finalize owns the default close orchestration and already calls ready/close/audit steps. |
| `src/task/task-close.ts` | reference | approved | Close readiness already includes done-level harness validation, evidence lint, protocol doctor, close-source hash, and close evidence append. |
| `src/services/validation-run.ts` | reference | approved | Remains the general wrapper for arbitrary command execution evidence. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | approved | Current workflow guidance already says harness is direct diagnostics; needs stronger default-loop wording. |

## Changes

| Area | Summary |
|---|---|
| Finalize | `--execute --auto` now records idempotent validation-category readiness evidence before close proof when close evidence is required, then refreshes close state before appending close evidence. |
| Report/schema | Added additive `readinessEvidence` metadata to `hadara.task.finalize.v1` execute reports. |
| Docs/templates | Updated current and generated workflow guidance so `harness validate` is a direct diagnostic, not a required evidence wrapper before ordinary auto finalize. |
| Tests | Added auto-finalize readiness evidence and closed-valid idempotency coverage; updated workflow/init expectations. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full command-portfolio cleanup can still demote/remove additional advanced surfaces after 0.4.1-rc.0. | Open | command-portfolio RFC |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-07 | Draft | Initial task scaffold. |
| 2026-07-07 | In Progress | Scoped to finalize-owned readiness evidence so the default close loop does not require a separate harness validation evidence wrapper. |
| 2026-07-07 | Done | Implemented auto-finalize readiness evidence, updated docs/templates/tests, and recorded focused validation plus built CLI smoke evidence. |
