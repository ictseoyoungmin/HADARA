# T-0743 Reduce legacy status surface and decompose close modules

## Identity

| Field | Value |
|---|---|
| ID | T-0743 |
| Title | Reduce legacy status surface and decompose close modules |
| Status | Done |
| Created | 2026-08-01T19:10 |
| Updated | 2026-08-01T20:00 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Reduce legacy status behavior and split close planning/execution by dependency without changing the RC2 close contract. | Primary smoke and docs use `task status`; legacy status compatibility is explicit and isolated; close modules become reviewable units with proof-last behavior preserved. |

## Scope

| Boundary | Items |
|---|---|
| In | Reduce `status.ts` to the primary task-status alias plus explicit legacy compatibility. |
| In | Change clean-checkout and related operational smoke routing from `status --json` to `task status --json`. |
| In | Extract close planning, readiness, write-set, marker, recovery, proof, audit, filesystem, and report responsibilities into dependency-directed modules. |
| In | Preserve current schemas, plan hashes, zero-write guards, proof-last ordering, and close report semantics. |
| Out | RC2 release metadata, package/readiness documentation, and Init v1 stages 6~8 acceptance. |
| Out | New close features, new schemas, public provider/MCP surfaces, and broad lifecycle redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Inventory status callers and close-module dependencies; freeze behavior and schema invariants. | Done |
| 2 | Remove primary dependence on legacy status output and update smoke/docs/tests to `task status`. | Done |
| 3 | Extract close modules in dependency order with parity tests after each boundary. | Done |
| 4 | Run focused/full validation and record evidence before close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Primary docs, smoke, and operational callers use `task status --json`; legacy `status` behavior remains only behind an explicit compatibility surface. | Met | Final focused routing and smoke tests passed; `ev:T-0743:5b4e41cff4d64d8a954c7bad`. | `docs/TASK_WORKFLOW_COMMANDS.md`, clean-checkout smoke contract |
| AC-2 | `status.ts` no longer owns primary project/global/state-summary behavior, and removed legacy flags cannot affect the primary lifecycle path. | Met | `status --state-only` and `status --summary-json` fail closed; final compatibility tests passed in `ev:T-0743:5b4e41cff4d64d8a954c7bad`. | Existing status compatibility tests |
| AC-3 | Close plan/execute extraction preserves plan hashes, guarded write sets, zero-write refusal, marker binding, recovery, proof append, and final audit behavior. | Met | Close regression suite passed after final extraction; full check passed in `ev:T-0743:8f0c6d7b9eb5459d8d1bc5f8`. | T-0741 close contract and focused close tests |
| AC-4 | Extracted module dependencies obey the boundary: planning is read-only, proof append does not own marker persistence, recovery does not format reports, and filesystem adapters do not decide lifecycle state. | Met | `filesystem-adapter.ts`, `operation-marker.ts`, `write-set.ts`, `recovery.ts`, and `report.ts` isolate the respective responsibilities; final build and close tests passed in `ev:T-0743:5b4e41cff4d64d8a954c7bad`. | Module boundary tests/diagnostics |
| AC-5 | Full check and relevant package/consumer smoke pass with evidence recorded. | Met | Final full check `ev:T-0743:8f0c6d7b9eb5459d8d1bc5f8`; final host package smoke `ev:T-0743:a8d7db4202ed48ae8f8cc320`; earlier sandbox failure was explicitly resolved by `ev:T-0743:b39ad82a49164d37bcee14a9`. | `npm run check`, package smoke, clean-checkout smoke |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Status surface focused tests | Yes | Passed | `status-json`, clean-checkout, package-recycle, and session-start routing tests passed. | `ev:T-0743:5b4e41cff4d64d8a954c7bad` |
| Close module focused tests | Yes | Passed | Task-close and close-source regression tests passed after final module extraction. | `ev:T-0743:5b4e41cff4d64d8a954c7bad` |
| Full npm check | Yes | Passed | exit 0 in 43342ms | `ev:T-0743:8f0c6d7b9eb5459d8d1bc5f8` |
| Package/consumer smoke | Yes | Passed | Final host package pack/install/init/doctor/command-surface smoke passed; sandbox child-process failure was resolved explicitly. | `ev:T-0743:a8d7db4202ed48ae8f8cc320`, `ev:T-0743:b39ad82a49164d37bcee14a9` |
| Final status and close module focused tests | Yes | Passed | exit 0 in 8228ms | `ev:T-0743:5b4e41cff4d64d8a954c7bad` |
| Final status and close module focused tests | Yes | Passed | exit 0 in 8228ms | ev:T-0743:5b4e41cff4d64d8a954c7bad |
| Final full npm check | Yes | Passed | exit 0 in 43342ms | ev:T-0743:8f0c6d7b9eb5459d8d1bc5f8 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/TASK_WORKFLOW_COMMANDS.md` | constraint | active | Primary lifecycle and status routing rules. |
| `docs/CLI_JSON_CONTRACT.md` | reference | active | Stable command/report boundaries and compatibility rules. |
| `src/task/close/plan.ts`, `src/task/close/execute.ts` | implementation-source | active | Current close behavior to decompose without semantic drift. |
| `tasks/T-0741-bind-close-marker-to-reviewed-plan-and-validate-full-surface/TASK.md` | background | implemented | Close marker, reviewed-plan, and proof-last invariants. |

## Changes

| Area | Summary |
|---|---|
| Status surface | Implemented | Top-level `status` now delegates to `task status`; only explicit `--compat v1` retains the legacy operations report. Primary smoke and session routing use `task status`. |
| Close architecture | Implemented | Filesystem primitives, operation marker persistence, reviewed write-set construction, and transaction report formatting are split from the orchestration modules. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Extraction could change close write ordering or recovery semantics. | Mitigated | Focused close regression and full check passed; reviewed close remains the final transaction gate. |
| RF-2 | Follow-up | Remaining legacy status references are historical, compatibility-only, or internal dashboard read models. | Closed | Active smoke/session/docs paths use `task status`; historical release/task records remain unchanged. |
Not started. This capsule is limited to runtime status compatibility and close-module structure; release/docs and Init v1 acceptance belong to T-0744.
## Close Summary


## History

| Date | State | Note |
|---|---|---|
| 2026-08-01 | Draft | Initial task scaffold. |
| 2026-08-01 | Draft | Split from the RC2 follow-up set: runtime status surface and close-module dependency boundaries only. |
| 2026-08-01 | In Progress | Reduced primary legacy status routing, updated smoke/read-surface callers, and extracted close filesystem, marker, write-set, and report responsibilities. |
| 2026-08-01 | Done | Focused validation, full npm check, and host package/consumer smoke passed; capsule is ready for proof-last close. |
