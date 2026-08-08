# T-0755 Remove Legacy Status and State Surface

## Identity

| Field | Value |
|---|---|
| ID | T-0755 |
| Title | Remove Legacy Status and State Surface |
| Status | Done |
| Created | 2026-08-08T19:12 |
| Updated | 2026-08-08T19:29 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Remove retired project/global status and task-status compatibility routes so `hadara task status` is the only lifecycle status ingress, with current smoke and schema coverage. |

## Scope

| Boundary | Items |
|---|---|
| In | CLI routing and registry, task-status compatibility metadata/options, dead project-status schema/service, package/context smoke routing, active guidance, and focused regression tests. |
| Out | Task-local HANDOFF documents, historical/archive records, operations status/TUI diagnostics, and published RC2 artifacts. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Top-level `status`, task-status `--compat/--summary-json`, and project-status v2 dead surfaces are removed from current routing and schemas. | Met | `ev:T-0755:93462dbab13e4618bbcacff8` | src/cli/main.ts; src/cli/task.ts |
| AC-2 | Current task-status reports and package/context smoke paths use only the current routes and schemas. | Met | `ev:T-0755:93462dbab13e4618bbcacff8` | src/services/task-status-v2.ts; tools/dev-surface/package-recycle.ts |
| AC-3 | Active guidance and measurement docs route readers to Task Board/task status without retired global-state ingress. | Met | `ev:T-0755:93462dbab13e4618bbcacff8` | docs/CLI_JSON_CONTRACT.md; scripts/primary-workflow-measurement.mjs |
| AC-4 | Full repository check passes after the removal. | Met | `ev:T-0755:8456660f5da74eaeabc6e73f` | `npm run check` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused legacy-surface regression tests | Yes | Passed | CLI/status/task-workbench/context-routing/schema/package-recycle coverage passed. | `ev:T-0755:93462dbab13e4618bbcacff8` |
| Build | Yes | Passed | TypeScript build passed after current-source edits. | `ev:T-0755:93462dbab13e4618bbcacff8` |
| Full repository check | Yes | Passed | exit 0 in 33731ms | ev:T-0755:8456660f5da74eaeabc6e73f |
| Focused legacy status surface regression | Yes | Passed | exit 0 in 2601ms | ev:T-0755:93462dbab13e4618bbcacff8 |
| Current status command surface | Yes | Passed | exit 0 in 147ms | ev:T-0755:bc52e1468ae848dd9827896b |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| docs/CLI_JSON_CONTRACT.md | constraint | active | Current public JSON command contracts and removed-route boundary. |
| docs/TASK_WORKFLOW_COMMANDS.md | constraint | active | Task status ingress and close workflow. |
| docs/RC2_CONTRACT_FREEZE.md | decision | active | Historical global-state paths remain forbidden. |
| src/cli/main.ts | implementation-source | active | Public CLI routing. |

## Changes

| Area | Summary |
|---|---|
| CLI surface | Removed top-level status alias and dead project-status implementation/schema. |
| Task status | Removed v1 compatibility fields and compact compatibility options; retained current fast/full reports. |
| Smoke and guidance | Context routing, package recycle, measurement, schema fixtures, and active docs use current task status. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Historical consumers of removed status routes must migrate to `hadara task status --json`. | Open | docs/CLI_JSON_CONTRACT.md |

## Close Summary

Legacy status/state ingress is removed from the current RC3 source line. Task-local capsules and Task Board remain the authoritative continuation surfaces.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-08 | In Progress | Removed current legacy status routes, project-status dead code, task-status compatibility metadata/options, and updated active smoke/docs/tests. |
| 2026-08-08 | Done | Full check passed; ready for reviewed proof-last close. |
