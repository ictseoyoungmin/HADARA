# T-0173 Workbench Schema Contract

## Metadata

| Field | Value |
|---|---|
| ID | T-0173 |
| Title | Workbench Schema Contract |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Register workbench schema contract. | Add fixture-level `hadara.task.workbench.v1` schema and focused validation coverage. |

## Scope

| In Scope | Reason |
|---|---|
| Schema fixture and registry. | Register `src/schemas/task-workbench.schema.json` in the schema index and runtime loader. |
| Contract tests. | Validate workbench reports and schema fixture alignment. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Breaking schema strictness. | Keep fixture additive while requiring stable envelope fields. |
| New command behavior. | This capsule documents and validates existing T-0171/T-0172 behavior only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | Task created through HADARA CLI. |
| 2026-05-31 | Done | Workbench schema fixture registered and focused schema validation passed. | `task-workbench`, `schema-fixtures`, and `workbench-next-actions` tests. |
