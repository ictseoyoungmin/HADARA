# T-0498 workflow docs consolidate implementation sop removal

## Identity

| Field | Value |
|---|---|
| ID | T-0498 |
| Title | workflow docs consolidate implementation sop removal |
| Status | Done |
| Created | 2026-07-06 |
| Updated | 2026-07-06 |

## Goal

| Goal | Notes |
|---|---|
| Consolidate workflow guidance on `docs/HADARA_WORKFLOW.md` and remove `docs/IMPLEMENTATION_SOP.md` from the current 0.4 scaffold surface. | The current repo still requires the legacy SOP while init-generated projects already use `docs/HADARA_WORKFLOW.md`, creating a protocol/document drift. |

## Scope

| Boundary | Items |
|---|---|
| In | Root required-reading docs, current docs registry, init scaffold/doctor/profile metadata paths, current command/read-map references, focused tests, and local feedback capture. |
| Out | 0.4.1-rc.0 command-surface removal, finalize `--auto`, package smoke drift gate, DEVELOPMENT_SLICES state prototype, and historical 0.3 spec rewrites. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the workflow-doc consolidation contract and capture local friction feedback. | Done |
| 2 | Add current `docs/HADARA_WORKFLOW.md`, remove root SOP, and update root required-reading routes. | Done |
| 3 | Update init/docs registry/code references so fresh/current 0.4 projects do not require SOP. | Done |
| 4 | Validate focused init/docs workflow behavior and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current root docs route workflow rules through `docs/HADARA_WORKFLOW.md` and `docs/TASK_WORKFLOW_COMMANDS.md`, with no default Required Reading dependency on `docs/IMPLEMENTATION_SOP.md`. | Met | ev:T-0498:b6158a034c4e45e1b0abaa01 | `AGENTS.md`, `.hadara/context/HADARA_CONTEXT.md`, `README.md` |
| AC-2 | `docs/IMPLEMENTATION_SOP.md` is removed from current tracked docs, and `.hadara/docs-registry.json` no longer registers it as a current document. | Met | ev:T-0498:b6158a034c4e45e1b0abaa01 | `.hadara/docs-registry.json` |
| AC-3 | Fresh init/doctor paths expect `docs/HADARA_WORKFLOW.md` and do not create or require SOP. | Met | ev:T-0498:b6158a034c4e45e1b0abaa01 | `src/cli/init.ts`, `tests/unit/init.test.ts` |
| AC-4 | Current CLI read-map/capability/docs-registry surfaces no longer advertise SOP as the active workflow authority. | Met | ev:T-0498:b6158a034c4e45e1b0abaa01 | `src/services/**`, `src/hermes/context-export.ts` |
| AC-5 | Focused validation passes and non-committed feedback is written under `.hadara/local/feedback/`. | Met | ev:T-0498:b6158a034c4e45e1b0abaa01 | `.hadara/local/feedback/` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused and expanded regression tests | Yes | Passed | ev:T-0498:6a1ea7301202461e81728a49 |
| Build | Yes | Passed | ev:T-0498:6a1ea7301202461e81728a49 |
| Init smoke | Yes | Passed | ev:T-0498:b6158a034c4e45e1b0abaa01 |
| Docs doctor | Yes | Passed | ev:T-0498:6a1ea7301202461e81728a49 |
| Harness validate T-0498 | Yes | Passed | ev:T-0498:6dd2380374504875a6dc5cf1 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `AGENTS.md` | constraint | implemented | Required reading now points at `docs/HADARA_WORKFLOW.md`. |
| `.hadara/context/HADARA_CONTEXT.md` | constraint | implemented | Compact read routing now includes the workflow guide. |
| `src/cli/init.ts` | implementation-source | implemented | Current init paths no longer patch or require SOP. |
| `docs/specs/0.4.1/rc0-scope.md` | reference | approved | 0.4.1-rc.0 work remains after this structural cleanup. |

## Changes

| Area | Summary |
|---|---|
| Docs | Added root `docs/HADARA_WORKFLOW.md`, removed `docs/IMPLEMENTATION_SOP.md`, updated AGENTS/README/context routing and docs registry. |
| CLI | Updated init, docs registry parsing, capability/read-map/context export, managed-section, and protocol diagnostics to use the workflow guide. |
| Tests | Updated focused init/task workflow/Hermes/MCP tests plus protocol, context, dashboard, dogfooding, and focused-test fixtures for the workflow guide split. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Remaining 0.4.1-rc.0 capsules still need package smoke drift gate, finalize `--auto`, slice state prototype, and lifecycle surface removal. | Open | `docs/specs/0.4.1/rc0-scope.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-06 | Draft | Initial task scaffold. |
| 2026-07-06 | In Progress | Scope narrowed to workflow-doc authority consolidation before remaining 0.4.1-rc.0 work. |
| 2026-07-06 | Done | Workflow authority consolidated on `docs/HADARA_WORKFLOW.md`; expanded SOP-removal regression validation passed. |
