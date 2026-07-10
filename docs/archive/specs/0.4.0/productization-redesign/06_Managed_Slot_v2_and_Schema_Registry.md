# 06 Managed Slot v2 and Schema Registry

## Goal

Define a compact, auditable managed slot model for HADARA 0.4.

Managed slots keep machine-owned fields small in Markdown while storing full schema metadata in `.hadara/slot-registry.json`.

## Slot Syntax

```md
<!-- hadara:slot task.identity -->
| Field | Value |
|---|---|
| ID | T-0001 |
| Title | Add dashboard action busy guard |
| Status | Draft |
| Created | 2026-06-29 |
| Updated | 2026-06-29 |
<!-- /hadara:slot -->
```

The marker is intentionally short. The registry owns schema, field policy, and allowed values.

## `.hadara/slot-registry.json`

Example:

```json
{
  "schemaVersion": "hadara.managedSlot.registry.v1",
  "registryVersion": 1,
  "slots": [
    {
      "id": "task.identity",
      "schemaVersion": "hadara.managedSlot.v2",
      "owner": "task.lifecycle",
      "allowedPaths": ["tasks/*/TASK.md"],
      "closeSourceRole": "included",
      "kind": "key-value-table",
      "fields": [
        {
          "name": "ID",
          "required": true,
          "editable": "cli-only",
          "pattern": "^T-[0-9]{4,}$"
        },
        {
          "name": "Title",
          "required": true,
          "editable": "cli-on-create"
        },
        {
          "name": "Status",
          "required": true,
          "editable": "lifecycle-or-constrained-md",
          "allowedValues": [
            "Draft",
            "In Progress",
            "Blocked",
            "Done",
            "Partial",
            "Superseded",
            "Archived"
          ]
        },
        {
          "name": "Created",
          "required": true,
          "editable": "cli-only",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        },
        {
          "name": "Updated",
          "required": true,
          "editable": "cli-or-managed",
          "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
        }
      ]
    }
  ]
}
```

## Registry Hash

Close proof must record a hash or version of the slot registry used to interpret close-source slots.

```json
{
  "slotRegistryVersion": 1,
  "slotRegistryHash": "sha256:..."
}
```

This prevents future HADARA versions from auditing old Markdown with incompatible slot semantics.

## Table Schema Registry

The slot registry may also define non-slot table schemas, such as `task.acceptance`.

```json
{
  "id": "task.acceptance",
  "kind": "markdown-table",
  "allowedPaths": ["tasks/*/TASK.md"],
  "closeSourceRole": "included",
  "columns": [
    { "name": "ID", "pattern": "^AC-[0-9]+$", "required": true },
    { "name": "Criterion", "editable": "agent-derived-prose", "required": true },
    { "name": "Required", "allowedValues": ["Yes", "No"], "required": true },
    { "name": "Status", "allowedValues": ["Pending", "Met", "Not Met", "Blocked", "Not Applicable"], "required": true },
    { "name": "Evidence", "pattern": "^(TBD|ev:.*|)$", "required": false },
    { "name": "Disposition", "allowedValues": ["Required", "Optional", "Deferred", "Accepted Risk", "Not Applicable", "Superseded"], "required": true },
    { "name": "Reference", "requiredWhenDispositionIn": ["Deferred", "Accepted Risk", "Superseded"] }
  ]
}
```

## Public Commands

0.4 may extend existing docs governance commands rather than introducing separate user-facing slot commands.

Preferred:

```bash
hadara docs managed list --json
hadara docs managed explain --path tasks/T-0001/TASK.md --json
```

Proposed new command only if necessary:

```bash
hadara docs slot explain --slot task.identity --json
```

Avoid exposing low-level slot patching as ordinary workflow. Slot patch execution, if implemented, should remain advanced and dry-run-first.

## Diagnostics

```text
SLOT_REGISTRY_MISSING
SLOT_REGISTRY_HASH_MISSING_IN_CLOSE_PROOF
SLOT_UNKNOWN
SLOT_PATH_NOT_ALLOWED
SLOT_FIELD_MISSING
SLOT_FIELD_INVALID_TOKEN
SLOT_DUPLICATE_CANONICAL_OWNER
TABLE_SCHEMA_UNKNOWN
TABLE_SCHEMA_COLUMN_MISSING
TABLE_SCHEMA_INVALID_TOKEN
```
