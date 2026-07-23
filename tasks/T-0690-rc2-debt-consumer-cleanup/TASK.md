# T-0690 RC2 Debt Consumer Cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0690 |
| Title | RC2 Debt Consumer Cleanup |
| Status | Done |
| Created | 2026-07-23T20:46 |
| Updated | 2026-07-23T20:51 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove developer-only operational-debt tools from the default public MCP bridge while keeping repo-local debt/release workflows intact for HADARA-dev maintenance. |

## Scope

| Boundary | Items |
|---|---|
| In | Remove `hadara.debt.list` and `hadara.debt.show` from the default MCP capability list, tool registry, and bridge contract; update the affected MCP/tools-list tests and active bridge docs. |
| Out | Dashboard debt routes, TUI debt/readiness aggregation, release-gate runtime deletion, or repo-local `tools/dev-surfaces.ts` debt workflows. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Default MCP discovery no longer advertises or dispatches operational-debt tools. | Done | `hadara.debt.list/show` were removed from the default MCP capability list, dispatch table, and bridge contract inventory while repo-local debt/release code remained untouched. | `src/services/capability-registry.ts`, `src/mcp/tool-registry.ts`, `docs/MCP_BRIDGE_CONTRACT.md` |
| AC-2 | Focused bridge and discovery regression coverage reflects the smaller MCP surface. | Done | `ev:T-0690:a911098b30724bd3b0b71dbb`, `ev:T-0690:6384685a6dfe40bcba25679c` | `tests/unit/mcp-server.test.ts`, `tests/unit/mcp-tools.test.ts`, `tests/contract/mcp-bridge-contract.test.ts`, `tests/unit/tools-list.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `timeout 60s npx vitest run tests/unit/mcp-server.test.ts tests/unit/mcp-tools.test.ts tests/contract/mcp-bridge-contract.test.ts tests/unit/tools-list.test.ts` | Yes | Passed | `ev:T-0690:a911098b30724bd3b0b71dbb` |
| `git diff --check` | Yes | Passed | `ev:T-0690:6384685a6dfe40bcba25679c` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0687-rc2-developer-surface-alignment/RC2_DEVELOPER_SURFACE_REPORT.md` | reference | active | RC2 marks operational debt as a HADARA-dev-facing surface that should be removed from user-facing routes. |
| `tasks/T-0689-rc2-developer-test-surface-split/HANDOFF.md` | reference | active | The next capsule should keep reducing remaining public developer-only runtime coupling in small slices. |
| `docs/CLI_JSON_CONTRACT.md` | reference | active | MCP-facing JSON consumers must stay aligned with the documented command/report surface. |
| `docs/MCP_BRIDGE_CONTRACT.md` | reference | active | The default bridge tool inventory must be updated together with implementation changes. |

## Changes

| Area | Summary |
|---|---|
| MCP debt surface | Removed `hadara.debt.list/show` from the default MCP capability registry and tool dispatch so the read-only bridge no longer exposes developer-only debt state. |
| Bridge contract/tests | Updated the MCP bridge contract inventory and the focused server/tools/contract discovery tests to match the smaller default tool list. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Dashboard and TUI still read debt aggregates even after the MCP debt tools are removed. | Open | `src/cli/dashboard.ts`, `src/services/dashboard-heavy-projection.ts`, `src/tui/read-model.ts` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-23 | Draft | Initial task scaffold. |
| 2026-07-23 | In Progress | Scoped the capsule to removing default MCP operational-debt tools before touching dashboard/TUI consumers. |
| 2026-07-23 | Done | Removed default MCP debt tools, updated bridge/discovery contracts, and passed focused bridge validation. |
