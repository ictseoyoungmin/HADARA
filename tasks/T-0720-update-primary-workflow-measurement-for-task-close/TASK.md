# T-0720 Update Primary Workflow Measurement For Task Close

## Identity

| Field | Value |
|---|---|
| ID | T-0720 |
| Title | Update Primary Workflow Measurement For Task Close |
| Status | Done |
| Created | 2026-07-28T15:59 |
| Updated | 2026-07-28T16:01 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Update `measure:primary-workflow` to the current public `task close` lifecycle. | Remove stale `task finalize` invocations from the active measurement harness and lock that regression down. |

## Scope

| Boundary | Items |
|---|---|
| In | Rewrite the primary workflow measurement script and its fixture prose to use `task close` review/execute, update command-id mapping/budget metadata, and add regression assertions against stale `task finalize` references. |
| Out | Full continuation backlog redesign, historical release-note cleanup, and internal finalize-engine removal. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `measure:primary-workflow` uses the current public close path and no longer invokes or names public `task finalize`. | Met | `ev:T-0720:6e6049bf7adc4690b1571d2a` | `scripts/primary-workflow-measurement.mjs`, `package.json` |
| AC-2 | Regression tests fail if the active measurement harness reintroduces stale `task finalize` commands or command ids. | Met | `ev:T-0720:6e6049bf7adc4690b1571d2a` | `tests/unit/primary-workflow-budget.test.ts` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| `npm test -- tests/unit/primary-workflow-budget.test.ts` | Yes | Passed | Primary workflow budget regression passed: 1 file, 4 tests. | `ev:T-0720:6e6049bf7adc4690b1571d2a` |
| `npm run build` | Yes | Passed | Source TypeScript build passed. | `ev:T-0720:6e6049bf7adc4690b1571d2a` |
| `npm run typecheck:tools` | Yes | Passed | Tools TypeScript compile passed. | `ev:T-0720:6e6049bf7adc4690b1571d2a` |
| `npm run measure:primary-workflow` | No | Blocked | Script now targets `task close`, but this environment still hits the known child-process `spawnSync ... EPERM` failure before init. | `ev:T-0720:6e6049bf7adc4690b1571d2a` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `/home/ymin/.codex/attachments/788d82e1-24e0-45f1-b814-83c19d7518a5/pasted-text.txt` | reference | active | Reviewer finding for stale measurement routing. |
| `scripts/primary-workflow-measurement.mjs` | constraint | active | Active built-CLI workflow measurement harness. |
| `tests/unit/primary-workflow-budget.test.ts` | reference | active | Existing budget regression for the measurement harness. |

## Changes

| Area | Summary |
|---|---|
| `scripts/primary-workflow-measurement.mjs` | Migrated the active six-step measurement harness from stale finalize review/execute to `task close --dry-run` plus reviewed `task close --execute --plan-hash`, updated command-id mapping, budget metadata, and disposable capsule fixture prose. |
| `tests/unit/primary-workflow-budget.test.ts` | Added regression assertions that the active harness contains `task close`, not `task finalize`, and keeps the four-command primary budget aligned with the current public surface. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | The measurement harness can be aligned with current `task close`, but it still measures only one routed continuation path and does not solve the broader multi-continuation backlog loss described in the reviewer note. | Open | `scripts/primary-workflow-measurement.mjs` |

## Close Summary

The active primary-workflow measurement harness now follows the current public `task close` review/execute path and is regression-guarded against reintroducing removed `task finalize` routing.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | In Progress | Scoped the active primary-workflow measurement regression around stale public finalize routing. |
| 2026-07-28 | Done | Repointed the active measurement harness to task close, added stale-command regression coverage, and validated the script source/build surfaces. |
