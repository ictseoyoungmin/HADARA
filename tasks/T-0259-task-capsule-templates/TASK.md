# T-0259 Task Capsule Templates

## Metadata

| Field | Value |
|---|---|
| ID | T-0259 |
| Title | Task Capsule Templates |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Add safe Task Capsule templates. | `hadara task create --from <template-id> --title <title> --json` should create Draft capsules with template defaults and schema-valid template metadata. |

## Scope

| In Scope | Reason |
|---|---|
| Template registry and task-create report. | Provides known templates and machine-readable creation output. |
| Release and lifecycle template defaults. | Required by T-0259 acceptance criteria. |
| Supporting template ids. | Adds evidence, operator workflow, protocol remediation, and UI polish defaults listed in the spec. |
| Tests and docs. | Proves schema, safe Draft behavior, unknown-template failure, and workflow semantics. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Marking tasks Done. | Templates are Draft scaffolds only. |
| Attaching evidence or close proof. | Template creation must not imply validation occurred. |
| Running validation or shell commands. | Task creation remains bounded to capsule files and Task Board row. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-05T06:00:00.000Z | Draft | Initial task scaffold created for Phase 6 Task Capsule templates work. | Task Capsule exists. |
| 2026-06-05T06:06:00.000Z | In Progress | Implemented template registry, task-create report/schema, tests, docs, and built smokes. | Docker validation and built CLI smokes. |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |
