# T-0659 Status fact model foundations (Phase A: declarative DAG status redesign)

## Identity

| Field | Value |
|---|---|
| ID | T-0659 |
| Title | Status fact model foundations (Phase A: declarative DAG status redesign) |
| Status | Done |
| Created | 2026-07-20T17:01 |
| Updated | 2026-07-20T17:15 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0659 --json`.

## Goal

| Goal | Notes |
|---|---|
| Introduce a shared, provenance-carrying Fact model (`src/status/`) that reproduces current project/task-selection facts, as Phase A of the Declarative DAG status/context-routing redesign in `.hadara/local/tmp_plan/status/redesign_candidate/HADARA_Declarative_DAG_Status_Context_Routing_Design.docx`. | No CLI/behavior change; purely additive internal foundation consumed by later phases. |

## Scope

| Boundary | Items |
|---|---|
| In | `src/status/model.ts` (`FactRecord<T>`, `EvaluationState`, controlled predicate/transformer vocabulary types); core adapters (`json-document`, `markdown-section`, `markdown-table`, `git-metadata`, `task-capsule`) reusing existing readers (`markdown-table.ts`, `task-capsule.ts`, `project-current-state.ts`); predicate functions (`equals/present/absent/empty/not-empty/contains/in/all/any/always`); transformer functions (`task-to-work-unit`, `known-problems-to-issues`, `markdown-input-list-to-references`, `registry-entry-to-context-source`, `task-board-row-to-work-candidate`); unit tests; a reproduction test showing the fact pipeline derives the same `currentRelease`/`activeTask`/`nextWork` values as `readProjectCurrentState` on this repository. |
| Out | DAG evaluator/graph schema (Phase B), continuation field/task-close promotion (Phase C), context-source registry vNext, CLI/public schema wiring, workspace reconciliation, any change to existing command output. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Add `src/status/model.ts` with `FactRecord`, `EvaluationState`, and controlled vocabulary types. | Done |
| 2 | Add predicate and transformer modules with the fixed vocabulary (no `eval`/arbitrary expressions). | Done |
| 3 | Add core adapters reusing existing markdown/task-capsule/current-state readers. | Done |
| 4 | Add unit tests plus a reproduction test against this repo's real state files. | Done |
| 5 | Validate (build + focused tests) and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `FactRecord`/`EvaluationState` model exists and every fact is explainable as `observed`/`declared`/`derived` via `authority`. | Met | ev:T-0659:9312a99ffa18457086ce8b48 | src/status/model.ts |
| AC-2 | Predicates and transformers are a closed, registered vocabulary with no arbitrary expression evaluation. | Met | ev:T-0659:9312a99ffa18457086ce8b48 | src/status/predicates.ts, src/status/transformers.ts |
| AC-3 | Reproduction test shows the fact pipeline derives `project.release`, `project.activeWork`, `project.nextWork` matching `readProjectCurrentState` output on this repo. | Met | ev:T-0659:9312a99ffa18457086ce8b48 | tests/unit/status-current-state-source.test.ts |
| AC-4 | No existing CLI command output or schema changes. | Met | ev:T-0659:d44381d2c1f143739b983dfe | build + full suite (159 files, 1181 tests, no regressions) |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests (status fact model) | Yes | Passed | ev:T-0659:9312a99ffa18457086ce8b48 |
| TypeScript build | Yes | Passed | ev:T-0659:3a12f23192c0442e88247043 |
| Full test suite | Yes | Passed | ev:T-0659:d44381d2c1f143739b983dfe |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/local/tmp_plan/status/redesign_candidate/HADARA_Declarative_DAG_Status_Context_Routing_Design.docx` | reference | active | Section 5 (Fact model / Source Adapter), section 5.4 (transform/predicate vocabulary limits). |
| `src/services/project-current-state.ts` | implementation-source | active | Canonical current-state reader; reproduction baseline. |
| `src/task/task-selection.ts`, `src/task/task-capsule.ts` | implementation-source | active | Existing markdown/task-capsule readers to wrap, not duplicate. |

## Changes

| Area | Summary |
|---|---|
| `src/status/model.ts` | `FactRecord<T>`, `EvaluationState`, `FactAuthority`, `FactStore`, and `presentFact`/`missingFact`/`invalidFact`/`mapFact` helpers. |
| `src/status/predicates.ts` | Closed predicate vocabulary (`equals`, `present`, `absent`, `empty`, `not-empty`, `contains`, `in`, `all`, `any`, `always`) evaluated against `FactRecord`. |
| `src/status/transformers.ts` | Closed transformer vocabulary (`task-to-work-unit`, `known-problems-to-issues`, `markdown-input-list-to-references`, `registry-entry-to-context-source`, `task-board-row-to-work-candidate`). |
| `src/status/adapters/*.ts` | `json-document` (JSON Pointer resolution), `markdown-section`, `markdown-table`, `git-metadata` (bounded read-only `git status`), and `task-capsule` (Task Capsule to `workUnit` fact) adapters, all reusing existing readers. |
| `src/status/sources/project-current-state-source.ts` | Composes the `json-document` adapter and transformers to reproduce `.hadara/state/current.json` facts, per docx section 5.2's example source declaration. |
| `tests/unit/status-*.test.ts` | 33 new focused tests, including a reproduction test against this repository's real `current.json`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Phase B (DAG evaluator) and Phase C (continuation promotion) depend on this fact model and are separate capsules. | Open | Phase B/C task capsules |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-20 | Draft | Initial task scaffold. |
| 2026-07-20 | Done | Fact model, predicates, transformers, and adapters implemented; 33 focused tests plus build and full suite (159 files / 1181 tests) passed. |
