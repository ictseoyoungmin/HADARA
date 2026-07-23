# T-0691 RC2 Dashboard Debt Projection Cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0691 |
| Title | RC2 Dashboard Debt Projection Cleanup |
| Status | Done |
| Created | 2026-07-23T21:07 |
| Updated | 2026-07-23T21:31 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove the dashboard surface from HADARA while preserving the remaining CLI, MCP, and TUI workflows that still belong to the reduced RC2 product boundary. | Latest operator instruction widened the original debt-only cleanup into full dashboard removal. |

## Scope

| Boundary | Items |
|---|---|
| In | Remove `hadara dashboard serve` routing, dashboard-only services/schemas/frontend build assets, and dashboard-focused tests/fixtures; retarget or simplify any remaining code paths that only exist to support dashboard reads. |
| Out | TUI removal, MCP removal, release/dev workflow removal, or unrelated DAG/status redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Remove dashboard code and repair surviving read surfaces. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Public and repo-local dashboard entry points, assets, and read models are removed from the codebase. | Done | Dashboard CLI/frontend/services/schemas/scripts/tests were removed, and dashboard-only docs were reduced to historical stubs. | `src/cli/dashboard.ts`, `dashboard/`, `src/services/dashboard-*.ts`, `src/schemas/dashboard-*.json`, `scripts/dashboard-*.mjs`, `docs/DASHBOARD_*.md` |
| AC-2 | Remaining surfaces no longer require dashboard-only code to build or run. | Done | TUI read aggregation, context boundaries, capability text, and current-state docs no longer depend on dashboard-only code paths. | `src/tui/read-model.ts`, `src/tui/cache.ts`, `src/context/*`, `src/services/capability-registry.ts`, `docs/PROJECT_STATE.md`, `docs/ROADMAP.md` |
| AC-3 | Focused validation and evidence capture cover the removal. | Done | `ev:T-0691:1fe4835986fe411f93498485`, `ev:T-0691:ded12d4e78444f579db5786e`, `ev:T-0691:4186a09a87274e8ab9884f1f` | task evidence |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| TypeScript noEmit | Yes | Passed | ev:T-0691:1fe4835986fe411f93498485 |
| Focused removal tests | Yes | Passed | ev:T-0691:ded12d4e78444f579db5786e |
| git diff check | Yes | Passed | ev:T-0691:4186a09a87274e8ab9884f1f |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0687-rc2-developer-surface-alignment/RC2_DEVELOPER_SURFACE_REPORT.md` | reference | active | RC2 prioritizes HADARA-dev-only surface reduction over broader redesign. |
| `docs/ARCHITECTURE.md` | reference | active | UI/runtime boundaries must stay aligned while the browser dashboard is removed and TUI remains. |
| `docs/ROADMAP.md` | reference | active | Shared current-state docs and roadmap boundaries must stop presenting dashboard as a shipped surface. |
| `docs/TEST_STRATEGY.md` | reference | active | Focused validation must keep default/public test guidance coherent after dashboard removal. |

## Changes

| Area | Summary |
|---|---|
| Dashboard runtime | Removed dashboard-specific CLI routing, read services, frontend assets, schemas, scripts, and test fixtures. |
| Surviving consumers | Simplified TUI/read-model and context-boundary code so surviving public surfaces no longer depend on dashboard-only paths. |
| Current-state docs | Updated architecture, roadmap, command-surface, schema, operational-debt, and workbench/status docs to describe TUI as the remaining UI boundary and convert dashboard-specific docs into historical stubs. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Historical records and long-range planning docs still mention the removed dashboard surface. | Open | `docs/TASK_BOARD.md`, `docs/DEVELOPMENT_SLICES.md`, `docs/V1_0_*` |
| RF-2 | Follow-up | T-0691 still needs task close and shared-state finalization before the capsule is terminal. | Open | `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `hadara task close --task T-0691 --json` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-23 | Draft | Initial task scaffold. |
| 2026-07-23 | In Progress | Latest operator instruction widened the capsule from dashboard debt cleanup to full dashboard removal with surviving-surface repair. |
| 2026-07-23 | In Progress | Removed dashboard code, repaired TUI/current docs, and recorded focused validation evidence; close is still pending. |
| 2026-07-23 | Done | Dashboard surface removal is implemented, focused validation passed, and the capsule is ready for task close. |
