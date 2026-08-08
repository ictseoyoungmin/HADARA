# T-0756 Remove Legacy Harness Validation Surface

## Identity

| Field | Value |
|---|---|
| ID | T-0756 |
| Title | Remove Legacy Harness Validation Surface |
| Status | Done |
| Created | 2026-08-08T19:38 |
| Updated | 2026-08-08T19:53 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove the retired `harness validate` CLI/MCP/schema surface while preserving the internal Task Capsule validation used by close and status diagnostics. |

## Scope

| Boundary | Items |
|---|---|
| In | Public CLI routing, command registry, MCP tool/schema, validation fixture schema, active init/workflow guidance, and internal module naming. |
| Out | Historical release notes/Task Board rows, fake-shell agent-loop harnesses, and the validation behavior required by close transactions. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `harness validate` is absent from current CLI/MCP routing, capability registry, and schema registry. | Met | `ev:T-0756:7f9b2034131940ac806af057` | src/cli/main.ts; src/services/capability-registry.ts |
| AC-2 | Close/status retain Task Capsule validation through a non-harness internal module. | Met | `ev:T-0756:7f9b2034131940ac806af057` | src/services/task-validation.ts; src/task/close/proof.ts |
| AC-3 | Active generated guidance and workflow docs no longer instruct the retired command. | Met | `ev:T-0756:7f9b2034131940ac806af057` | src/init/templates.ts; docs/TASK_WORKFLOW_COMMANDS.md |
| AC-4 | Full repository check passes. | Met | `ev:T-0756:97dfeb5190cf4983a4313ee9` | `npm run check` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused task-validation and removed-surface tests | Yes | Passed | Build and focused CLI/MCP/schema/task-validation tests passed. | `ev:T-0756:7f9b2034131940ac806af057` |
| Full repository check | Yes | Passed | exit 0 in 37558ms | ev:T-0756:97dfeb5190cf4983a4313ee9 |
| Removed harness validation surface regression | Yes | Passed | exit 0 in 4299ms | ev:T-0756:7f9b2034131940ac806af057 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| docs/TASK_WORKFLOW_COMMANDS.md | constraint | active | Current lifecycle command contract. |
| docs/MCP_BRIDGE_CONTRACT.md | constraint | active | Current MCP read-only tool contract. |
| src/task/close/proof.ts | implementation-source | active | Close-owned validation integration. |

## Changes

| Area | Summary |
|---|---|
| Validation module | Moved internal capsule validation out of `src/harness` and renamed its report types. |
| Public surfaces | Removed CLI handler, MCP tool, registry entry, schema fixture, and related tests. |
| Guidance | Removed retired command instructions from generated and active workflow docs. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Historical records still mention the retired command by design. | Open | docs/history; docs/archive |

## Close Summary

The retired harness validation surface is removed. Close and status use the renamed internal Task Capsule validation module, while historical records remain unchanged.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-08 | In Progress | Removed public harness validation routes and moved retained validation logic to the task-validation service. |
| 2026-08-08 | Done | Full check passed; validation issue codes and active guidance no longer use the retired harness surface. |
