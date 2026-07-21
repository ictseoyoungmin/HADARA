# T-0677 Structured Continuation Semantics and rc2 Baseline Rollup

## Identity

| Field | Value |
|---|---|
| ID | T-0677 |
| Title | Structured Continuation Semantics and rc2 Baseline Rollup |
| Status | Done |
| Created | 2026-07-21T23:33 |
| Updated | 2026-07-21T23:40 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0677 --json`.

## Goal

| Goal | Notes |
|---|---|
| Make structured continuation semantics fail-closed for contradictory machine-readable values and restore the current validation baseline as an rc.2-ready evidence rollup. | This follows reviewer feedback after T-0676: typo handling was fixed, but semantic conflicts and too-narrow baseline anchoring still needed a bounded correction before the next release candidate. |

## Scope

| Boundary | Items |
|---|---|
| In | HANDOFF structured continuation semantic conflict validation; non-actionable continuation default task-creation behavior; focused tests; rc.2 scope documentation as “current + Phase D through end”; validationBaseline promotion with T-0667/T-0668/T-0669/T-0676/T-0677 evidence rollup. |
| Out | Bumping package metadata to `0.5.0-rc.2`, running release readiness, npm/GitHub publication, implementing Phase D itself, adding a new `validationBaseline.rollup` schema field. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and rc.2 boundary. | Done |
| 2 | Implement structured continuation semantic conflict validation. | Done |
| 3 | Update rc.2 scope and baseline-rollup docs/current state. | Done |
| 4 | Validate, record evidence, promote baseline, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Structured HANDOFF table values fail closed when `Disposition` and `Create Task` conflict. | Met | ev:T-0677:befc562b23d64cbe82a74623 | `src/task/task-finish.ts` |
| AC-2 | Non-actionable structured dispositions default to `createCommandAllowed:false` when `Create Task` is omitted. | Met | ev:T-0677:befc562b23d64cbe82a74623 | `src/services/project-current-state.ts` |
| AC-3 | Focused tests cover malformed create-task typo, terminal+yes conflict, actionable+no conflict, and waiting-for-operator default no-create behavior. | Met | ev:T-0677:befc562b23d64cbe82a74623 | `tests/unit/status-continuation.test.ts` |
| AC-4 | rc.2 scope is documented as current reviewer fixes plus Phase D through the end of the 0.5 DAG/status redesign before rc.2 release readiness. | Met | ev:T-0677:befc562b23d64cbe82a74623 | `docs/RELEASE_READINESS.md`; `docs/RELEASE_NOTES.md`; `docs/PROJECT_STATE.md` |
| AC-5 | Current validation baseline is promoted with rollup evidence spanning source/release readiness, npm/GitHub publish records, installed recycle/dogfood, reviewer remediation, and this task. | Met | ev:T-0677:0e81fde64eb5490096248221 | `.hadara/state/current.json` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- --run tests/unit/status-continuation.test.ts tests/unit/project-current-state.test.ts` | Yes | Passed | ev:T-0677:befc562b23d64cbe82a74623 |
| `npm run build` | Yes | Passed | ev:T-0677:befc562b23d64cbe82a74623 |
| `npm run dev:docker-sync-build` | Yes | Passed | ev:T-0677:befc562b23d64cbe82a74623 |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | ev:T-0677:befc562b23d64cbe82a74623 |
| `node dist/cli/main.js status baseline promote ... --task T-0677 --json` | No | Failed | Expected task-owner guard for cross-task rollup; resolved by no-task rollup path. ev:T-0677:69c8f071da3f4fe882101046 |
| `node dist/cli/main.js status baseline promote ... --json/--execute --plan-hash ...` | Yes | Passed | ev:T-0677:0e81fde64eb5490096248221 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer feedback | reference | active | Major 2/3: structured semantic fail-closed and baseline rollup. |
| T-0660/T-0661 handoff | reference | active | Phase D is the context-route resolver / registry stable-id follow-up after phases A-C. |
| T-0667 evidence | reference | active | rc1 release-readiness recycle source/release evidence. |
| T-0668 evidence | reference | active | npm publish record and installed-package recycle. |
| T-0669 evidence | reference | active | GitHub Release publication and Docker installed-package dogfood. |
| T-0676 evidence | reference | active | reviewer remediation and baseline-promote surface hardening. |

## Changes

| Area | Summary |
|---|---|
| Structured continuation | Added semantic conflict validation for `Disposition`/`Create Task` combinations. |
| Current-state continuation | Non-actionable structured dispositions no longer default to follow-up task creation when `Create Task` is omitted. |
| Release docs | rc.2 scope is current reviewer fixes plus Phase D through the end of the 0.5 DAG/status redesign. |
| Validation baseline | Promoted a flat evidence rollup spanning T-0667, T-0668, T-0669, T-0676, and T-0677 instead of only the latest remediation command evidence. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `validationBaseline.rollup` as a first-class schema field remains a future structured-state improvement; this capsule preserves rollup through summary/evidence refs only. | Open | `.hadara/state/current.json` |
| RF-2 | Follow-up | `status baseline promote --task <task>` is intentionally narrow and rejects cross-task evidence; multi-task release rollups must omit `--task` until a first-class rollup schema/command is introduced. | Closed | ev:T-0677:69c8f071da3f4fe882101046; ev:T-0677:0e81fde64eb5490096248221 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-21 | Draft | Initial task scaffold. |
| 2026-07-21 | In Progress | Implemented structured continuation semantic conflict checks and focused tests. |
| 2026-07-21 | Done | Validated, promoted rc.2 planning baseline rollup, and prepared capsule for close. |
