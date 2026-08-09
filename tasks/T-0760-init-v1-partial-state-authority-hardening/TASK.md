# T-0760 Init v1 Partial-State Authority Hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0760 |
| Title | Init v1 Partial-State Authority Hardening |
| Status | Done |
| Created | 2026-08-09T21:13 |
| Updated | 2026-08-09T21:25 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0760 --json`.

## Goal

| Goal | Notes |
|---|---|
| Make Init v1 authority selection fail closed for partial or malformed state and route init doctor plus docs read/write through one canonical validator. | A valid `.hadara/project.json` and `.hadara/documents.json` pair selects Init v1; legacy fallback is allowed only when neither Init v1 file exists. |

## Scope

| Boundary | Items |
|---|---|
| In | Shared Init v1 state reader, project/document canonical validation, partial-state blockers, docs registry read/write selection, init doctor validation, and regression coverage. |
| Out | Close architecture changes, release publication, package recycle, document content extraction, and unrelated legacy registry redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the canonical Init v1 state matrix and blocker vocabulary. | Done |
| 2 | Implement shared validation and route init/docs consumers through it. | Done |
| 3 | Validate all state combinations and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Valid Init v1 requires and validates both canonical files, and docs read/write plus init doctor select that same authority. | Met | ev:T-0760:4c7302fc2dbe41348c3ce504; ev:T-0760:85ce8d6fbf6f4831b9d3eba6 | `docs/specs/0.5.0-rc3/00_Init_V1_Document_Routing_Authority.md` |
| AC-2 | Project-only, documents-only, malformed, and invalid cross-file Init v1 states fail closed with structured blockers and do not select legacy or inferred writable authority. | Met | ev:T-0760:4c7302fc2dbe41348c3ce504 | `docs/specs/0.5.0-rc3/00_Init_V1_Document_Routing_Authority.md` |
| AC-3 | Legacy-only projects retain `.hadara/docs-registry.json` compatibility, while valid Init v1 with legacy residue keeps Init v1 as the sole writable authority. | Met | ev:T-0760:4c7302fc2dbe41348c3ce504 | `docs/specs/0.5.0-rc3/00_Init_V1_Document_Routing_Authority.md` |
| AC-4 | Focused regression tests, full repository validation, and built CLI Init/docs doctor smokes pass. | Met | ev:T-0760:4c7302fc2dbe41348c3ce504; ev:T-0760:7a080cf46f6f4831b9d3eba6; ev:T-0760:85ce8d6fbf6f4831b9d3eba6; ev:T-0760:5c3dda87ad6248c583bca0fd | The clean Init v1 fixture smoke passes; the earlier repo-root legacy scaffold failure is resolved in evidence as a non-candidate baseline observation. |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused Init/docs authority tests | Yes | Passed | 5 files / 84 tests; ev:T-0760:4c7302fc2dbe41348c3ce504 |
| Full repository validation | Yes | Passed | `npm run check`; ev:T-0760:7a080cf46cfc43439a74a76b |
| Built CLI Init v1 fixture smoke | Yes | Passed | init, init doctor, and docs list; ev:T-0760:85ce8d6fbf6f4831b9d3eba6 |
| Built CLI build | Yes | Passed | `npm run build`; ev:T-0760:1bc1bbf1c21c423eb72bf470 |
| Built CLI legacy docs list smoke | Yes | Passed | docs list; ev:T-0760:3ca3624e6c1e477b877824a2 |
| Built CLI init doctor smoke (repo-root baseline) | No | Failed | Known legacy scaffold baseline; ev:T-0760:e5cae32256f8430a958c047b |
| Built CLI init doctor smoke | Yes | Passed | ev:T-0760:5c3dda87ad6248c583bca0fd |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5.0-rc3/00_Init_V1_Document_Routing_Authority.md` | constraint | active | Partial or invalid Init v1 state must not infer a writable authority. |
| `docs/HADARA_WORKFLOW.md` | workflow | active | Use Docker build/check and built CLI for HADARA-dev source changes. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | workflow | active | Evidence and proof-last lifecycle semantics. |
| `src/init/model.ts` | implementation-source | active | Canonical Init v1 validators. |

## Changes

| Area | Summary |
|---|---|
| Authority reader | Done | Added `readValidatedInitV1State()` with two-file pairing, canonical validators, partial/invalid blockers, and legacy-residue warning. |
| Docs service | Done | Docs read/list/doctor/read-map and mutations now consume the shared state boundary and do not write inferred partial state. |
| Init doctor | Done | Init doctor now reports the same canonical project/document validation and structured partial-state blocker. |
| Tests | Done | Added valid, partial, malformed, duplicate, legacy-residue, docs mutation, and upgrade fail-closed regression coverage. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Keep release/readiness refresh separate because source changes stale T-0759 evidence. | Open | T-0761 |

## History

| Date | State | Note |
|---|---|---|
| 2026-08-09 | Draft | Initial task scaffold. |
| 2026-08-09 | In Progress | Defined the shared Init v1 authority matrix and fail-closed boundary from the RC3 review. |
| 2026-08-09 | Ready for close | Shared authority reader, docs/init consumers, regression tests, full check, build, and clean Init v1 built CLI smoke passed; repo-root legacy doctor baseline recorded as non-gate residual. |
| 2026-08-09 | Done | Implementation and validation complete; proof-last lifecycle close is ready. |
