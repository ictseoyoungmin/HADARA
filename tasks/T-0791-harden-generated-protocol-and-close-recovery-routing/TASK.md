# T-0791 Harden generated protocol and close recovery routing

## Identity

| Field | Value |
|---|---|
| ID | T-0791 |
| Title | Harden generated protocol and close recovery routing |
| Status | Done |
| Created | 2026-08-14T09:17Z |
| Updated | 2026-08-14T09:47Z |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make fresh Init v1 guidance and task status/close routing faithfully describe current preset, read, mutation, execute, and recovery semantics. | Resolve the five P1 findings from current-build dogfood before public docs are reconciled. |

## Scope

| Boundary | Items |
|---|---|
| In | Init templates/help, generated AGENTS routing, selected-task next-action metadata, compact close execute routing, virtual post-write HANDOFF validation, focused regressions, build refresh, and isolated dogfood. |
| Out | Broad lifecycle redesign, release publication, unrelated P2 projection polish, and closing T-0790 before human visual review. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reproduce and map each P1 to its owning source/test boundary. | Done |
| 2 | Align generated preset and status-first read-routing guidance. | Done |
| 3 | Correct status and compact close next-action mutation/execute metadata. | Done |
| 4 | Move HANDOFF continuation semantics into virtual post-write preflight and cover conflict recovery. | Done |
| 5 | Build, run focused/full validation, and repeat isolated Init/capsule dogfood. | Done |
| 6 | Record evidence and hand verified output back to T-0790. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh generated workflow/help use the `--preset` choices `minimal`, `standard`, and `governed` and do not present profile as current Init authority. | Met | `ev:T-0791:736fb8d56c214430821436e6` | Init template/help tests and fresh scaffold |
| AC-2 | Fresh `AGENTS.md`, registry read policy, and `docs read-map` agree on status-first session routing and fallback-only Markdown projections. | Met | `ev:T-0791:736fb8d56c214430821436e6` | Init model/read-map tests and current-build dogfood |
| AC-3 | Selected status labels evidence append recommendations as `evidence-append` writes requiring policy-aware review metadata. | Met | `ev:T-0791:736fb8d56c214430821436e6` | Task status/workbench regression and current-build JSON |
| AC-4 | Compact executable close plans return an execute command carrying the current reviewed plan hash rather than another dry-run. | Met | `ev:T-0791:736fb8d56c214430821436e6` | Task close regression and T-0001 dogfood |
| AC-5 | Virtual post-write preflight rejects invalid HANDOFF continuation semantics before any lifecycle write, preventing the reproduced recovery trap. | Met | `ev:T-0791:736fb8d56c214430821436e6` | Transaction regression and T-0002 hash/marker check |
| AC-6 | Current rebuilt CLI passes focused/full checks and isolated Init/capsule dogfood including blocked-prewrite, closed-valid, and zero-write retry paths. | Met | `ev:T-0791:736fb8d56c214430821436e6` resolves `ev:T-0791:93d9e6a458ee4d58ae15ba42`, `ev:T-0791:56686db428324ebfa6ffaf64` | Byte-bound reduced dogfood report |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Init template/model tests | Yes | Passed | Current preset vocabulary, fallback routing, and help registry checks passed. | `ev:T-0791:736fb8d56c214430821436e6` |
| Task status/workbench tests | Yes | Passed | Evidence recommendation reports `evidence-append`, reviewed, and writes=true. | `ev:T-0791:736fb8d56c214430821436e6` |
| Task close focused tests | Yes | Passed | Reviewed plan-hash action and zero-write virtual post-close conflict preflight passed. | `ev:T-0791:736fb8d56c214430821436e6` |
| Build and full check | Yes | Passed | Docker build/tools typecheck; 1,070 core and 145 HADARA-dev tests passed after recorded failed attempts were resolved. | `ev:T-0791:736fb8d56c214430821436e6` resolves `ev:T-0791:93d9e6a458ee4d58ae15ba42`, `ev:T-0791:56686db428324ebfa6ffaf64` |
| Isolated current-build dogfood | Yes | Passed | Fresh standard Init, routing, evidence metadata, reviewed close, closed-valid, zero-write retry, semantic conflict no-write, repair, and close all passed. | `ev:T-0791:736fb8d56c214430821436e6`; bound artifact |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0790-repair-docs-site-diagrams-for-visual-readability/artifacts/current-build-init-capsule-doc-audit.md` | background | active | Exact RC6 dogfood findings and reproductions. |
| `src/init/model.ts`; `src/init/templates.ts`; `src/services/capability-registry.ts` | implementation-source | active | Fresh scaffold and public help ownership. |
| `src/services/task-workbench.ts`; `src/services/workbench-next-actions.ts`; `src/services/task-status-v2.ts` | implementation-source | active | Selected-task action construction and compact projection. |
| `src/task/close/plan.ts`; `src/task/close/guardedWrites.ts`; `src/task/close/execute.ts` | implementation-source | active | Virtual preflight, compact next action, and recovery transaction. |
| `docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md` | constraint | active | Proof-last, pre-mutation validation, and recovery invariants. |
| `docs/ARCHITECTURE.md`; `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Init authority and task workflow boundaries. |

## Changes

| Area | Summary |
|---|---|
| Investigation | Mapped five dogfood P1 findings to Init, status, and close transaction owners. |
| Init guidance | Replaced stale profile examples with current presets and aligned generated AGENTS with status-first registry routing. |
| Status metadata | Added explicit Workbench action write/review metadata so evidence append is not inferred as read-only. |
| Close routing | Public executable close-plan actions now carry the reviewed plan hash and use the task-close transaction boundary. |
| Close preflight | Guarded-write planning validates both current pre-close and future post-close HANDOFF continuation semantics before mutation. |
| Verification | Added focused regressions, rebuilt `dist`, passed the full gate, and reduced fresh two-capsule dogfood into a byte-bound artifact. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Runtime source changes invalidate the previous RC6 release candidate input identity and require a new candidate after T-0790 visual approval. | Open | Release readiness follow-up |
| RF-2 | Risk | Close recovery changes must preserve deterministic marker/hash fail-closed behavior for genuine source conflicts. | Mitigated | Full close/recovery suite and built-CLI no-write dogfood |

## Close Summary

Aligned fresh Init routing and public help, made selected-status evidence writes explicit, returned executable reviewed close actions, and moved future post-close HANDOFF semantics into pre-mutation validation. Full tests and isolated built-CLI dogfood passed; T-0790 remains open only for human visual review.

## History

| Date | State | Note |
|---|---|---|
| 2026-08-14 | Draft | Initial task scaffold. |
| 2026-08-14 | Done | Completed runtime/scaffold hardening, full validation, bound dogfood evidence, and T-0790 reconciliation. |
