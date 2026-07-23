# T-0695 RC2 Release Metadata Cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0695 |
| Title | RC2 Release Metadata Cleanup |
| Status | Done |
| Created | 2026-07-23T23:33 |
| Updated | 2026-07-23T23:41 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Align release-readiness metadata with the developer-surface move completed in T-0694. | Remove stale `src/services` ownership/path references and make repo-local release/debt command metadata point at the current `tools/` implementations and focused tests. |

## Scope

| Boundary | Items |
|---|---|
| In | `src/services/capability-registry.ts` repo-local command metadata for debt/dev/smoke/release commands; `src/schemas/schema-index.json` ownership cleanup for moved release/smoke schemas; current docs that still point at removed `src/services` developer-surface files. |
| Out | Runtime behavior changes, release-readiness logic redesign, TUI/status redesign, archive/history-only cleanup, and any new developer-surface features. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Align release/developer-surface metadata and current docs to the moved `tools/` ownership. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current command/schema/doc metadata no longer points at removed `src/services` developer-surface files for the cleaned release/smoke/debt scope. | Done | `ev:T-0695:7082517c3ebc4407ae19eafd`, `ev:T-0695:c402e868b83e432096e87a8a` | `src/services/capability-registry.ts`, `src/schemas/schema-index.json`, `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`, `docs/specs/0.4.1/rc0-scope.md`, `src/context/release-extractors.ts` |
| AC-2 | Focused validation covers the metadata cleanup and is recorded in task evidence. | Done | `ev:T-0695:7082517c3ebc4407ae19eafd`, `ev:T-0695:c402e868b83e432096e87a8a` | `tests/unit/command-registry.test.ts`, `tests/unit/tools-list-command-registry.test.ts`, `tests/unit/context-graph-release-extractors.test.ts`, `tests/unit/schema-runtime.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused registry/context/schema tests | Yes | Passed | ev:T-0695:7082517c3ebc4407ae19eafd |
| git diff --check | Yes | Passed | ev:T-0695:c402e868b83e432096e87a8a |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0687-rc2-developer-surface-alignment/RC2_DEVELOPER_SURFACE_REPORT.md` | reference | active | Defines the RC2 developer-surface reduction boundary and coupled metadata surfaces. |
| `tasks/T-0694-rc2-release-services-tui-cleanup/HANDOFF.md` | background | active | Calls out release-readiness context/schema ownership cleanup as the next RC2 boundary. |
| `docs/PROJECT_STATE.md` | reference | active | Records T-0694 completion and T-0695 scope. |
| `docs/AGENT_HANDOFF.md` | reference | active | Resume guidance for the active capsule. |
| `src/context/release-extractors.ts` | implementation-source | active | Live path cleanup was not needed there, but focused validation exposed that release-readiness command extraction still needed repo-local command coverage. |

## Changes

| Area | Summary |
|---|---|
| Command metadata | Added `implementationFiles` and `testFiles` for repo-local debt/dev/smoke/release command entries in `src/services/capability-registry.ts`. |
| Schema ownership | Retargeted release/smoke/package schema owners in `src/schemas/schema-index.json` to the current `tools/dev-surface/*` implementation files. |
| Context routing | Updated `src/context/release-extractors.ts` to include repo-local command entries when mapping release-readiness code spans. |
| Current docs | Replaced stale removed-path references in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` and `docs/specs/0.4.1/rc0-scope.md`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Archive/history-only stale path cleanup remains out of scope unless a later capsule explicitly reopens it. | Open | `docs/archive/README.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-23 | Draft | Initial task scaffold. |
| 2026-07-23 | In Progress | Scoped the capsule to release metadata and live-document ownership cleanup. |
| 2026-07-23 | Done | Aligned repo-local release/developer metadata and current docs to `tools/` ownership, fixed release-readiness repo-local command extraction, and passed focused validation. |
