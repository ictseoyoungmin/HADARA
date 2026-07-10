# T-0559 Primary workflow budget and capability freeze

## Identity

| Field | Value |
|---|---|
| ID | T-0559 |
| Title | Primary workflow budget and capability freeze |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Freeze HADARA's ordinary Task Capsule path at four unique public commands and six lifecycle invocations, then measure that path end to end. | Add policy, executable measurement, and regression coverage without adding a public CLI command. |

## Scope

| Boundary | Items |
|---|---|
| In | Primary workflow budget; capability-freeze rule; lifecycle/portfolio doc alignment; disposable standard-profile measurement harness; regression tests; P2 toy lifecycle. |
| Out | New public commands, provider/runtime changes, broad docs archival, release mutation, performance optimization unrelated to measured workflow. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the four-command/six-invocation primary workflow and capability-freeze policy. | Done |
| 2 | Add an executable temp-project measurement harness and portfolio regression tests. | Done |
| 3 | Align lifecycle/portfolio docs with the executable 0.4.2 surface. | Done |
| 4 | Run focused/full validation and standard toy measurement to closed-valid. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The primary lifecycle is explicitly frozen at `task.status`, `task.create`, `validation.run`, and `task.finalize`. | Met | ev:T-0559:ace8a95f299341b8b6fc1773 | docs/PRIMARY_WORKFLOW_BUDGET.md |
| AC-2 | The ordinary post-init lifecycle budget is six CLI invocations including review and execute finalize. | Met | ev:T-0559:4f9b167c4ca24aec8f4d007d | measurement report/test |
| AC-3 | A disposable standard project executes the measured path and reaches `closed-valid`. | Met | ev:T-0559:4f9b167c4ca24aec8f4d007d | scripts/primary-workflow-measurement.mjs |
| AC-4 | Focused and full Docker validation pass without adding a public command. | Met | ev:T-0559:ace8a95f299341b8b6fc1773, ev:T-0559:7ad5dab1394b4be584b73235 | tests and command registry |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Primary workflow budget regressions | Yes | Passed | ev:T-0559:ace8a95f299341b8b6fc1773 |
| Standard measured toy lifecycle | Yes | Passed | ev:T-0559:4f9b167c4ca24aec8f4d007d |
| Full Docker sync-build | Yes | Passed | ev:T-0559:7ad5dab1394b4be584b73235 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request 2026-07-10 | constraint | active | Complete P0-P3 as separate committed capsules and dogfood each stage. |
| src/services/capability-registry.ts | implementation-source | active | Canonical command roles and default-help surface. |
| src/services/lifecycle-guide.ts | implementation-source | active | Registry-backed primary path projection. |
| docs/COMMAND_PORTFOLIO_AUDIT.md | implementation-source | active | Command overlap and retirement decisions. |

## Changes

| Area | Summary |
|---|---|
| workflow policy | Added a normative four-command/six-invocation budget, capability-freeze exception rule, and product metrics. |
| measurement | Added a repo-local built-CLI harness that creates a standard temp project, measures six invocations, and verifies `closed-valid`. |
| lifecycle docs | Aligned Lifecycle Guide and Command Portfolio Audit with the executable 0.4.2 surface. |
| regressions | Locked the registry-backed primary ids and measurement contract without adding a public command. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | P3 owns broad historical specs archival and multi-profile external-style dogfood. | Deferred | P3 capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | Done | Four-command freeze, six-invocation measurement, full validation, and standard toy close completed. |
