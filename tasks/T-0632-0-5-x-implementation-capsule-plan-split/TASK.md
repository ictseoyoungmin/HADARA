# T-0632 0.5.x implementation capsule plan split

## Identity

| Field | Value |
|---|---|
| ID | T-0632 |
| Title | 0.5.x implementation capsule plan split |
| Status | Done |
| Created | 2026-07-17 |
| Updated | 2026-07-17 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0632 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Split the combined HADARA 0.5.x plan into release-bounded implementation plans. | Choose a defensible release count, then specify capsule budgets, schemas, dependencies, implementation scope, validation, and promotion gates for each release. |

## Scope

| Boundary | Items |
|---|---|
| In | `docs/specs/0.5/` release index; one development-plan Markdown file for each selected 0.5.x release folder; alignment with the combined agent-loop and lifecycle/use-case inputs. |
| Out | Product code changes; CLI/schema implementation; release publication; rewriting the combined source plans. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Read current-state, workflow, architecture, security, validation, roadmap, budget, and combined 0.5.x source documents. | Done |
| 2 | Select release boundaries and define a cross-release dependency/promotion model. | Done |
| 3 | Author the release index and per-release capsule, schema, implementation, and validation plans. | Done |
| 4 | Validate document structure, internal links, scope coverage, and repository docs health; record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The combined 0.5.x scope is split into explicit release folders with a documented rationale and dependency order. | Met | `ev:T-0632:f2387de6d2f448869c8ddb97` | `docs/specs/0.5/README.md` |
| AC-2 | Every release plan defines capsule budgets, schema work, implementation boundaries, acceptance gates, and validation/dogfood. | Met | `ev:T-0632:f2387de6d2f448869c8ddb97` | `docs/specs/0.5/0.5.*/` |
| AC-3 | The split preserves status routing, task-close safety, evidence locality, and structured-state promotion constraints from the combined plans. | Met | `ev:T-0632:f2387de6d2f448869c8ddb97` | Combined source coverage map and release plans |
| AC-4 | Documentation validation evidence is recorded. | Met | `ev:T-0632:0087cc6d51ac4c87929a15fc`, `ev:T-0632:d834cc52783844f5ac70d802` | Task evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Release-plan structure and source-coverage audit | Yes | Passed | ev:T-0632:f2387de6d2f448869c8ddb97 |
| Markdown links and docs governance checks | Yes | Passed | ev:T-0632:0087cc6d51ac4c87929a15fc |
| Focused docs registry tests | Yes | Passed | ev:T-0632:d834cc52783844f5ac70d802 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/all/HADARA_0_5_X_Combined_Agent_Loop_Plan.md` | implementation-source | active | Command, schema, close transaction, state direction, and release sequencing. |
| `docs/specs/0.5/all/HADARA_0_5_X_Combined_Lifecycle_Usecases.md` | implementation-source | active | Project/task/session/release lifecycle and use-case coverage. |
| `docs/PRIMARY_WORKFLOW_BUDGET.md` | constraint | active | Existing command and invocation budget baseline. |
| `docs/CLI_JSON_CONTRACT.md` | constraint | active | Public JSON schema and compatibility baseline. |
| `docs/ARCHITECTURE.md` | constraint | active | Runtime and ownership boundaries. |
| `docs/SECURITY_MODEL.md` | constraint | active | Write, lock, evidence, and execution safety constraints. |
| `docs/TEST_STRATEGY.md` | constraint | active | Required validation layers. |
| `docs/ROADMAP.md` | constraint | active | Scope and deferred-work boundaries. |

## Changes

| Area | Summary |
|---|---|
| Task Capsule | Created T-0632 and authored the planning contract. |
| `docs/specs/0.5/README.md` | Chose four release slices, defined the common capsule/workflow budgets, cross-release dependencies, invariants, validation matrix, and source coverage. |
| `docs/specs/0.5/0.5.0` through `0.5.3` | Added four release development plans with 23 bounded capsule IDs, schema plans, split triggers, implementation detail, acceptance, dogfood, promotion, and rollback. |
| Docs governance | Registered five derived plans as proposed active specs and two combined inputs as reference-only; docs doctor is clean. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Capsule budgets are planning ceilings, not a substitute for per-capsule estimation after source inspection. | Mitigated | Each release plan defines split triggers. |
| RF-2 | Follow-up | Implementation capsules must be created individually when development begins; this task only authors the release plan. | Open | `docs/specs/0.5/README.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-17 | Draft | Initial task scaffold. |
| 2026-07-17 | Done | Authored and validated the four-release 0.5.x implementation capsule plan split. |
