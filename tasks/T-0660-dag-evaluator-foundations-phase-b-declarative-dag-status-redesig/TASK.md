# T-0660 DAG evaluator foundations (Phase B: declarative DAG status redesign)

## Identity

| Field | Value |
|---|---|
| ID | T-0660 |
| Title | DAG evaluator foundations (Phase B: declarative DAG status redesign) |
| Status | Done |
| Created | 2026-07-20T17:16 |
| Updated | 2026-07-20T17:26 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0660 --json`.

## Goal

| Goal | Notes |
|---|---|
| Add a read-only Declarative DAG graph schema and evaluator (`src/status/dag/`) that consumes the Phase A (T-0659) Fact model, plus a `generic-governed` graph fixture whose routing decision agrees with the existing `task-selection-status-v2` recommendation-vs-idle outcome. | Phase B of the Declarative DAG status/context-routing redesign in `.hadara/local/tmp_plan/status/redesign_candidate/HADARA_Declarative_DAG_Status_Context_Routing_Design.docx` (section 7-8). No CLI wiring or behavior change. |

## Scope

| Boundary | Items |
|---|---|
| In | `src/status/dag/schema.ts` (node types `source`/`decision`/`fallback`/`expand`/`emit`, `GraphEdge`, `GraphBudgets`, `StatusGraph`); `src/status/dag/validate.ts` (cycle detection, duplicate node id, missing edge source/target, terminal `emit` node outgoing-edge rejection, unregistered predicate rejection); `src/status/dag/evaluate.ts` (bounded traversal using Phase A's `evaluatePredicate`/`FactStore`, `maxDepth` budget enforcement, explainable trace with `selectedPath`/`selectionReason`/`fallbackUsed`); a `generic-governed` graph fixture built on Phase A's `project.activeWork`/`project.nextWork` fact keys; a parity test comparing the DAG evaluator's has-work-vs-idle routing decision against `createTaskSelectionStatusV2Report`'s recommendation-vs-idle outcome on equivalent fixtures. |
| Out | `expand` node evaluation (belongs to the Phase D context-route resolver; the Phase B evaluator explicitly fails closed with `EXPAND_NODE_NOT_SUPPORTED` instead of silently no-op'ing), dynamic string-keyed adapter dispatch/registry (Phase D), authority-precedence conflict detection between canonical and fallback routes, same-priority conflicting-emit-route detection, CLI/public schema wiring, any change to existing command output. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Add `src/status/dag/schema.ts` graph types. | Done |
| 2 | Add `src/status/dag/validate.ts` (cycle/dup-id/missing-target/terminal-edge/unknown-predicate checks). | Done |
| 3 | Add `src/status/dag/evaluate.ts` bounded traversal engine with explainable trace. | Done |
| 4 | Add the `generic-governed` graph fixture and unit tests for validator + evaluator. | Done |
| 5 | Add the parity test against `task-selection-status-v2` and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Graph validator rejects cycles, duplicate node ids, missing edge targets, terminal-node outgoing edges, and unregistered predicate operators. | Met | ev:T-0660:72af784a35404404b3420ac3 | src/status/dag/validate.ts, tests/unit/status-dag-schema.test.ts |
| AC-2 | Evaluator traversal is bounded by `budgets.maxDepth` and never executes arbitrary code (only Phase A's closed predicate vocabulary). | Met | ev:T-0660:72af784a35404404b3420ac3 | src/status/dag/evaluate.ts |
| AC-3 | Evaluator produces an explainable trace (`selectedPath`, `selectionReason`, `fallbackUsed`) for every result, including budget-exceeded and no-match outcomes. | Met | ev:T-0660:72af784a35404404b3420ac3 | tests/unit/status-dag-evaluate.test.ts |
| AC-4 | Parity test shows the `generic-governed` graph's has-work-vs-idle decision agrees with `task-selection-status-v2`'s recommendation-vs-idle decision on matching fixtures. | Met | ev:T-0660:72af784a35404404b3420ac3 | tests/unit/status-dag-parity.test.ts |
| AC-5 | No existing CLI command output or schema changes. | Met | ev:T-0660:585f054ce2a548cbb1fef53a | build + full suite (162 files, 1199 tests, no regressions) |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests (status DAG) | Yes | Passed | ev:T-0660:72af784a35404404b3420ac3 |
| TypeScript build | Yes | Passed | ev:T-0660:a58f5a64381b408c950e1d1d |
| Full test suite | Yes | Passed | ev:T-0660:585f054ce2a548cbb1fef53a |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/local/tmp_plan/status/redesign_candidate/HADARA_Declarative_DAG_Status_Context_Routing_Design.docx` | reference | active | Section 7 (Declarative DAG schema), section 7.5 (graph validation rules), section 8 (evaluation pipeline). |
| `src/status/model.ts`, `src/status/predicates.ts` | implementation-source | active | Phase A (T-0659) `FactRecord`/`FactStore`/`evaluatePredicate`, reused rather than duplicated. |
| `src/services/task-selection-status-v2.ts` | implementation-source | active | Existing recommendation-vs-idle behavior used as the parity baseline. |

## Changes

| Area | Summary |
|---|---|
| `src/status/dag/schema.ts` | `NodeType` union (`source`/`decision`/`fallback`/`expand`/`emit`), `GraphEdge`, `GraphBudgets`, `StatusGraph`. |
| `src/status/dag/validate.ts` | `validateGraph`: cycle detection, duplicate node id, missing edge source/target, terminal-emit outgoing-edge, unregistered predicate operator. |
| `src/status/dag/evaluate.ts` | `evaluateGraph`: validates first, then bounded `maxDepth` traversal using Phase A's `evaluatePredicate`/`FactStore`; fails closed on `expand` nodes and budget overrun; returns an explainable trace. |
| `src/status/dag/fixtures/generic-governed.ts` | Minimal generic-governed graph scoped to `project.activeWork`/`project.nextWork`. |
| `tests/unit/status-dag-schema.test.ts`, `status-dag-evaluate.test.ts` | 16 new tests covering validator rules and evaluator routing/fallback/budget/no-match/short-circuit behavior. |
| `tests/unit/status-dag-parity.test.ts` | 3 new tests comparing the DAG's has-work-vs-idle decision against `createTaskSelectionStatusV2Report` on active-task, structured-next-work, and idle fixtures. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Phase C (continuation model) is the actual T-0658-class bug fix and does not depend on the DAG evaluator; Phase D (context route resolver) and Phase E (public `hadara.project.status.v3` projection) would consume this evaluator later. | Open | Phase C/D/E task capsules |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-20 | Draft | Initial task scaffold. |
| 2026-07-20 | Done | DAG schema, validator, evaluator, generic-governed fixture, and parity test implemented; 21 focused tests plus build and full suite (162 files / 1199 tests) passed. |
