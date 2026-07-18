# T-0656 0.5.0 pre-stable public surface and close recovery hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0656 |
| Title | 0.5.0 pre-stable public surface and close recovery hardening |
| Status | Done |
| Created | 2026-07-18T22:39 |
| Updated | 2026-07-18T23:12 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0656 --json`.

## Goal

| Goal | Notes |
|---|---|
| Align the 0.5 public status/task-close contract with code and harden close recovery diagnostics before stable promotion. | Incorporates two reviewer reports about `task close` public routing, `status --detail full`, selected-task fast/full semantics, lock recovery, and stale public docs. |

## Scope

| Boundary | Items |
|---|---|
| In | `status --detail full` v2 routing; uninitialized/adoption next-action precedence; selected-task v2 compact/full provenance and close-readiness semantics; task-close stale lock reclaim, token-checked lock release, and operation progress recovery state; public JSON/docs contract cleanup; focused tests and full suite validation. |
| Out | 0.5.0 stable publish/recycle; process-kill fault injection harness; broader dashboard read-model performance refactor; complete all-or-nothing close transaction rewrite beyond recovery-capable wrapper. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reconcile reviewer feedback with current public 0.5 status/task-close boundaries. | Done |
| 2 | Patch status v2 detail routing, task-selection precedence, selected-task compact/full semantics, and close transaction lock/recovery behavior. | Done |
| 3 | Update JSON contract/current-state docs and tests to match the public surface. | Done |
| 4 | Validate focused tests, full suite, TypeScript build, and Docker dist sync. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara status --detail full --json` remains on the v2 project-status path and actually requests full compatibility-source diagnostics. | Done | `ev:T-0656:f8e6096276644bacb6df75e6` | `src/cli/status.ts`, `src/services/project-status-v2.ts`, `tests/unit/status-json.test.ts` |
| AC-2 | Uninitialized projects route to `hadara init --json` before task creation recommendations. | Done | `ev:T-0656:f8e6096276644bacb6df75e6` | `src/services/project-status-v2.ts`, `tests/unit/status-json.test.ts` |
| AC-3 | Fast selected-task status does not claim close-ready when close-grade checks were skipped, and compact output excludes the full legacy workbench unless `--detail full` is requested. | Done | `ev:T-0656:f8e6096276644bacb6df75e6` | `src/services/task-status-v2.ts`, `tests/unit/task-workbench.test.ts` |
| AC-4 | Task-close locks can reclaim stale/dead-owner lock dirs while live-owner lock contention remains fail-closed, and operation state tracks progress for retry/recovery reports. | Done | `ev:T-0656:f8e6096276644bacb6df75e6` | `src/task/task-close-transaction.ts`, `tests/unit/task-close.test.ts` |
| AC-5 | Public docs identify `task close` as the public close surface, remove stale `task close` removal wording, and classify `task finalize` as compatibility/debug source metadata. | Done | `ev:T-0656:f8e6096276644bacb6df75e6` | `docs/CLI_JSON_CONTRACT.md`, `docs/PROJECT_STATE.md`, `tests/unit/task-workflow-docs.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused public status/close tests | Yes | Passed | `ev:T-0656:f8e6096276644bacb6df75e6` |
| Full unit suite: 153 files passed, 1 skipped; 1136 tests passed, 7 skipped | Yes | Passed | `ev:T-0656:f8e6096276644bacb6df75e6` |
| TypeScript build | Yes | Passed | `ev:T-0656:f8e6096276644bacb6df75e6` |
| Docker sync build / dist freshness: built CLI smoke reported `distLooksStale:false` | Yes | Passed | `ev:T-0656:f8e6096276644bacb6df75e6` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `/home/ymin/.codex/attachments/7c18e2c4-36d1-4007-a557-e2fc6b3e124e/pasted-text.txt` | reference | active | Reviewer noted status detail routing, uninitialized precedence, selected-task fast close-ready, writeBoundary, compact output, lock/recovery gaps. |
| `/home/ymin/.codex/attachments/302292f6-cc1e-4166-b95a-3ba0acc934bc/pasted-text.txt` | reference | active | Reviewer noted CLI JSON contract conflict, stale PROJECT_STATE publish wording, stable-readiness recycle requirement, and transaction wording limits. |
| `docs/CLI_JSON_CONTRACT.md` | implementation-source | active | Public JSON contract source. |
| `src/services/project-status-v2.ts` | implementation-source | active | Project status v2 routing/action source. |
| `src/services/task-status-v2.ts` | implementation-source | active | Selected-task v2 cockpit source. |
| `src/task/task-close-transaction.ts` | implementation-source | active | Public task-close transaction wrapper. |

## Changes

| Area | Summary |
|---|---|
| Project status v2 | `--detail full` now reaches v2 status sources and setup/adoption phases outrank task creation recommendations. |
| Selected-task status v2 | Compact mode now exposes summary provenance without embedding full workbench, and close-ready requires full close-grade checks. |
| Task close | Added stale lock reclaim diagnostics, token-checked lock release, operation resume/progress persistence, and stale lock regression coverage. |
| Docs/tests | Updated CLI JSON contract/current-state wording and refreshed tests for current public `task close` semantics. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full stable readiness/recycle must be rerun after this capsule because source and docs changed after the previous rc readiness. | Open | `tasks/T-0648-0-5-0-rc-0-release-readiness-and-publish-preparation/` |
| RF-2 | Follow-up | Dashboard live read-model routes remain slow on HADARA-dev mounted workspaces; tests were timeout-adjusted and local feedback records the debt. | Open | `.hadara/local/feedback/T-0656-dashboard-mounted-route-timeout.md` |
| RF-3 | Follow-up | `task close` is recovery-capable and transaction-style, not a fully atomic crash-safe all-or-nothing transaction; release wording should avoid overclaiming. | Open | `docs/CLI_JSON_CONTRACT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | In Progress | Implemented public surface and close recovery hardening from reviewer feedback. |
| 2026-07-18 | Done | Focused tests, full suite, TypeScript build, and Docker sync build passed. |
