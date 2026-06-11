# T-0299 0.3.0-rc.1 protocol migration for 0.3 adoption

## Metadata

| Field | Value |
|---|---|
| ID | T-0299 |
| Title | 0.3.0-rc.1 protocol migration for 0.3 adoption |
| Status | Done |
| Created | 2026-06-11 |
| Updated | 2026-06-11 |

## Goal

| Goal | Notes |
|---|---|
| Add dry-run-first 0.3 protocol migration for existing HADARA projects. | `hadara protocol migrate --target 0.3.0` must detect scaffold generation, plan project/task scoped adoption writes, require a reviewed before-hash for execute, and stop before any rc.1 release/publish capsule. |

## Scope

| In Scope | Reason |
|---|---|
| `docs/specs/0.3.0/rc1` migration spec | Defines rc.1 adoption scope separately from release readiness. |
| `hadara protocol migrate --target 0.3.0` project scope | Upgrades existing project surfaces: docs registry, command docs, Required Reading rows, managed markers, and protocol version marker. |
| `hadara protocol migrate --target 0.3.0 --task <id>` task scope | Allows selected old Task Capsules to receive evidence index and managed Status History markers without broad historical rewrites. |
| JSON schema and command registry integration | External agents must discover and validate the new migration surface. |
| README/package metadata consistency | README must not instruct installing unpublished rc.1; npm package metadata should point to the public `HADARA` repo before later rc.1 publish. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Publishing `hadara@0.3.0-rc.1` | User explicitly deferred publish until later feature/fix work and a final readiness capsule. |
| GitHub Release, tag push, Docker image, PyPI/TestPyPI mutation | Release mutations belong in a separate operator-approved capsule. |
| Broad historical docs/archive cleanup | Existing docs cleanup commands provide explicit dry-run surfaces; migration should not delete or move user-authored context. |
| Mass migration of every historical Task Capsule | Task scope is selected and intentional. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-11 | Draft | Initial task scaffold. | Created by `hadara task create`. |
| 2026-06-11 | In Progress | Implementing rc.1 protocol migration adoption scope. | T-0299 capsule docs updated. |
| 2026-06-11 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
