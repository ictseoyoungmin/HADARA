# T-0308 Required Reading Command Output Tiering

## Metadata

| Field | Value |
|---|---|
| ID | T-0308 |
| Title | Required Reading Command Output Tiering |
| Status | Done |
| Created | 2026-06-12 |
| Updated | 2026-06-12 |

## Goal

| Goal | Notes |
|---|---|
| Add additive semantic `tier` metadata to `docs required-reading --json`. | T-0308 is the command-output follow-up to T-0307 guidance. |

## Scope

| In Scope | Reason |
|---|---|
| Required-reading report builder. | Emits the JSON field. |
| Required-reading schema and schema docs. | Consumers need the new field documented while preserving additive compatibility. |
| Focused tests and built CLI smoke. | Proves current-state/task-work/conditional/historical/excluded tiering. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Rewriting the docs registry schema. | T-0308 derives tiers from existing registry fields. |
| Removing or renaming existing `documents`/`excluded` arrays. | Backward compatibility requires preserving them. |
| Changing T-0307 human guidance text beyond command-output documentation. | Guidance-only work is already complete. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-12 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
