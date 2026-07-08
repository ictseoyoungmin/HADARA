# T-0530 split init implementation by ownership boundary

## Identity

| Field | Value |
|---|---|
| ID | T-0530 |
| Title | split init implementation by ownership boundary |
| Status | Done |
| Created | 2026-07-08 |
| Updated | 2026-07-08 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Split the large init implementation into ownership-based modules without changing generated scaffold text or CLI behavior. | Keep this capsule as a mechanical refactor; do not revise init UX copy, templates, or command semantics. |

## Scope

| Boundary | Items |
|---|---|
| In | Move init profile/types, scaffold assembly, generated templates, doctor diagnostics, and upgrade helpers out of `src/cli/init.ts` into `src/init/**`; keep public exports and command behavior compatible. |
| Out | Any generated Markdown wording changes, profile behavior changes, command surface changes, registry schema changes, or new runtime dependencies. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract and current init boundaries. | Done |
| 2 | Extract ownership modules while preserving generated output and public init exports. | Done |
| 3 | Run focused init/build validation and Docker dist refresh. | Done |
| 4 | Update task/global handoff state, finalize, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `src/cli/init.ts` is reduced to CLI-facing orchestration while init profile/types/scaffold/templates/doctor/upgrade logic lives under `src/init/**`. | Met | `ev:T-0530:add0563b2b744306b93d5716` | `src/cli/init.ts`, `src/init/**` |
| AC-2 | Generated init scaffold content and init command behavior remain unchanged except for module ownership/import paths. | Met | `ev:T-0530:c12315aa60ef43f1b3a15616`, `ev:T-0530:f8a04f134be34f3281c2aa67` | `tests/unit/init.test.ts` |
| AC-3 | Build and focused init-related tests pass, and Docker sync-build refreshes `dist`. | Met | `ev:T-0530:add0563b2b744306b93d5716`, `ev:T-0530:c12315aa60ef43f1b3a15616`, `ev:T-0530:d8d7c9cb370d4a6daef61942` | `npm run build`, focused Vitest, Docker sync-build |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| TypeScript build | Yes | Passed | ev:T-0530:add0563b2b744306b93d5716 |
| Focused init tests | Yes | Passed | ev:T-0530:c12315aa60ef43f1b3a15616 |
| Built init smoke | Yes | Passed | ev:T-0530:f8a04f134be34f3281c2aa67 |
| Docker sync-build | Yes | Passed | ev:T-0530:d8d7c9cb370d4a6daef61942 |
| Diff whitespace | Yes | Passed | ev:T-0530:64d26b917eb04abea8e8c8da |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `src/cli/init.ts` | implementation-source | active | Source file to split mechanically. |
| `tests/unit/init.test.ts` | reference | active | Primary generated scaffold and init behavior coverage. |
| `docs/HADARA_WORKFLOW.md` | constraint | active | Requires Docker sync-build/dist refresh for HADARA-dev CLI source changes. |

## Changes

| Area | Summary |
|---|---|
| CLI init surface | `src/cli/init.ts` now contains routing/help/mode parsing plus compatibility exports only. |
| Init services | Added `src/init/types.ts`, `profile.ts`, `project.ts`, `scaffold.ts`, `templates.ts`, `doctor.ts`, `upgrade.ts`, `files.ts`, and `report.ts` to separate profile policy, generation, diagnostics, mutation planning, shared file helpers, and output formatting. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Mechanical extraction can accidentally alter generated template text; validate with existing init tests and generated-doc smoke instead of editing template copy. | Open | `tests/unit/init.test.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-08 | Draft | Initial task scaffold. |
| 2026-07-08 | In Progress | Split init implementation modules and completed focused/Docker validation. |
