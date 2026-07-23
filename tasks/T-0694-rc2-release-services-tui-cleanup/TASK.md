# T-0694 RC2 Release Services TUI Cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0694 |
| Title | RC2 Release Services TUI Cleanup |
| Status | Done |
| Created | 2026-07-23T22:35 |
| Updated | 2026-07-23T23:10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Move the remaining HADARA-dev-only debt/release/smoke service implementations and debt command handler out of shipped `src/` into `tools/`, and leave shipped TUI/status surfaces with placeholder-only debt/release projections. | Remove the remaining built-package dependency on developer-only release/readiness logic without redesigning general task/status behavior. |

## Scope

| Boundary | Items |
|---|---|
| In | Move debt/release/smoke service modules and the debt command handler into `tools/dev-surface/`, retarget repo-local tools/tests/metadata, and stop shipped `src/tui` / `src/services/operations-status-service.ts` from computing debt or release-gate state. |
| Out | Reworking release-readiness docs/context extraction, changing general task lifecycle/status selection behavior, or redesigning the shipped TUI layout/schema. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm the remaining developer-only service modules and shipped consumers still coupled to them. | Done |
| 2 | Move the developer-only debt/release/smoke implementation set into `tools/` and replace shipped TUI/status consumers with placeholders. | Done |
| 3 | Run focused validation, record evidence, and close if ordinary lifecycle surfaces remain intact. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Shipped `src/` no longer contains the debt command handler or developer-only debt/release/smoke service implementations; repo-local `tools/` owns those paths instead. | Done | `ev:T-0694:00990ab2fe634a3b95d52285`, `ev:T-0694:3d72f6b4cddd4f148a4b581c`, `ev:T-0694:748d569ab17b444f8b1ed616` | `tools/dev-surface/`, `src/services/`, `src/cli/` |
| AC-2 | Shipped TUI/status surfaces no longer compute developer-only debt or release-gate reports, and focused validation plus lifecycle regression remain green. | Done | `ev:T-0694:39777b30d3d44bdeb8c125d3`, `ev:T-0694:430acdc105e9499d8fd976e3`, `ev:T-0694:3d72f6b4cddd4f148a4b581c` | `src/tui/read-model.ts`, `src/services/operations-status-service.ts`, `tests/unit/*` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| focused developer-surface tests | Yes | Passed | ev:T-0694:00990ab2fe634a3b95d52285 |
| public TUI/status regression tests | Yes | Passed | ev:T-0694:39777b30d3d44bdeb8c125d3 |
| task-close lifecycle regression | Yes | Passed | ev:T-0694:430acdc105e9499d8fd976e3 |
| TypeScript noEmit | Yes | Passed | ev:T-0694:3d72f6b4cddd4f148a4b581c |
| git diff check | Yes | Passed | ev:T-0694:748d569ab17b444f8b1ed616 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0687-rc2-developer-surface-alignment/RC2_DEVELOPER_SURFACE_REPORT.md` | reference | active | Defines the remaining debt/release/smoke services plus TUI consumers as the next RC2 cleanup boundary. |
| `docs/PROJECT_STATE.md` | reference | active | Confirms deeper release/readiness service and TUI cleanup is the next boundary after T-0693. |
| `docs/ARCHITECTURE.md` | reference | active | Installed product boundary remains the ordinary CLI/TUI/read-only MCP workflow, not HADARA-dev release tooling. |
| `docs/TEST_STRATEGY.md` | reference | active | Public tests must stay separate from HADARA-dev-only release/debt/dev coverage. |

## Changes

| Area | Summary |
|---|---|
| Developer-only service relocation | Move debt/release/smoke implementation modules and their debt command handler from built `src/` into repo-local `tools/dev-surface/`. |
| Shipped placeholder cleanup | Keep shipped TUI/status debt and release-gate projections as placeholders so public read models stop invoking developer-only logic. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Release-readiness context extraction, schema ownership notes, and other release-doc coupling may still reference the removed developer surface after code relocation. | Open | `src/context/release-extractors.ts`, `src/schemas/schema-index.json` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-23 | Draft | Initial task scaffold. |
| 2026-07-23 | In Progress | Narrowed the capsule to moving remaining developer-only debt/release/smoke services into `tools/` and leaving shipped TUI/status surfaces on placeholders. |
| 2026-07-23 | Done | Moved the remaining debt/release/smoke services and debt handler into `tools/dev-surface/`, deleted the shipped `src` copies, kept shipped TUI/status debt and release-gate views placeholder-only, and passed focused validation plus lifecycle regression. |
