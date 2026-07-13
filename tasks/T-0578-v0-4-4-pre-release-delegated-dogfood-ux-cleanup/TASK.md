# T-0578 v0.4.4 pre-release delegated dogfood UX cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0578 |
| Title | v0.4.4 pre-release delegated dogfood UX cleanup |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Fix release-candidate UX issues found by the delegated Claude governed-profile dogfood before v0.4.4 release readiness. | Focus on generated continuation docs, product metadata bootstrap behavior, and closed-task status wording; keep already-fixed version/bootstrap issues covered by regression tests. |

## Scope

| Boundary | Items |
|---|---|
| In | Governed `AGENT_HANDOFF.md` scaffold history routing, init-time product metadata defaults, docs doctor metadata placeholder diagnostics, and `task status` readiness labels for valid closed tasks. |
| Out | New release/publish behavior, broad handoff history generation, external-agent orchestration, and changing close/finalize proof semantics. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Review T-0577 delegated dogfood findings and classify code changes needed before release. | Done |
| 2 | Patch generated docs and diagnostics so fresh governed projects do not present empty/TBD continuation surfaces after work exists. | Done |
| 3 | Patch selected-task status readiness wording for closed-valid tasks so fast-path skipped checks do not read as active blockers. | Done |
| 4 | Validate focused tests, sync built dist, record evidence, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Governed init handoff scaffold no longer contains an empty `Last 3 Completed Tasks` table or `TBD` historical index rows. | Met | ev:T-0578:8ced49066f7845fabc5ffffc | T-0577 R3-F2 |
| AC-2 | Init uses existing package metadata when available and docs doctor still warns when product name/purpose remain unset after completed task history exists. | Met | ev:T-0578:d6aa3fa64f014b958a3a59e2 | T-0577 R3-F3 |
| AC-3 | `task status` readiness for closed-valid tasks distinguishes stale current checks from intentionally deferred fast-path checks without the fast-path label saying `blocked`. | Met | ev:T-0578:8ced49066f7845fabc5ffffc | T-0577 R3-F7 |
| AC-4 | Existing bootstrap/version regressions remain covered by focused tests. | Met | ev:T-0578:d6aa3fa64f014b958a3a59e2 | T-0577 R3-F1/F5/F6 |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests for init docs, docs doctor, task status/workbench, current-state, task-selection, session-start, and runtime version | Yes | Passed | ev:T-0578:d6aa3fa64f014b958a3a59e2 |
| Docker sync build / dist refresh after source changes | Yes | Passed | ev:T-0578:f86f092587994b3399a3c3b6 |
| Built CLI scaffold/status smoke | Yes | Passed | ev:T-0578:8ced49066f7845fabc5ffffc |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0577-v0-4-4-r3-delegated-claude-external-dogfood-validation/R3_CLAUDE_DOGFOOD_REPORT.md` | reference | active | Delegated Claude findings from installed 0.4.3 governed dogfood. |
| `tasks/T-0577-v0-4-4-r3-delegated-claude-external-dogfood-validation/R3_REVIEWER_CLASSIFICATION.md` | reference | active | Reviewer classification of already-fixed vs follow-up findings. |
| `src/init/templates.ts` | implementation-source | active | Generated project docs. |
| `src/services/docs-registry.ts` | implementation-source | active | Docs doctor metadata diagnostics. |
| `src/services/task-workbench.ts` | implementation-source | active | Selected task status/readiness projection. |

## Changes

| Area | Summary |
|---|---|
| Init scaffold | `docs/PROJECT_STATE.md` now uses existing package `name`/`description` when available; fallback values are explicit `Project name/purpose not set` text. |
| Governed handoff scaffold | Removed the empty `Last 3 Completed Tasks` table and `TBD` historical rows; generated handoff routes history to Task Board, task handoffs, evidence JSONL, and evidence summaries. |
| Docs doctor | Placeholder metadata detection now covers the new unset text and points operators at package metadata inference plus direct Product row editing. |
| Task status | Fast selected-task status now reports `closed-valid-current-not-checked` when close proof is valid and current done-level checks were intentionally skipped. |
| Tests / dist | Added focused coverage for init metadata, governed handoff history routing, docs doctor metadata behavior, and updated task workbench schema/tests; Docker sync build refreshed `dist`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | If richer completed-task summaries are desired in governed handoff, design it as a separate generated projection with explicit ownership. | Open | T-0577 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Scoped delegated dogfood UX fixes before v0.4.4 release readiness. |
| 2026-07-13 | Done | Implemented R3 pre-release UX cleanup and recorded focused, Docker, and built CLI smoke evidence. |
