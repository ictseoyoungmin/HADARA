# T-0333 Evidence v2 ID Visibility and List UX

## Metadata

| Field | Value |
|---|---|
| ID | T-0333 |
| Title | Evidence v2 ID Visibility and List UX |
| Status | Done |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Make `hadara evidence list` the supported durable evidence id discovery surface. | Text output must expose copyable ids plus category/outcome, and JSON output must expose id stability metadata for agents. |

## Scope

| In Scope | Reason |
|---|---|
| Show evidence ids in text `evidence list` output. | Operators need copyable ids for exact `resolves:` / `supersedes:` markers. |
| Show category/outcome in text output. | Evidence v2 semantics should be visible without JSON parsing. |
| Verify JSON list id contract fields. | Agents need stable `id`, `idSource`, `idStability`, `persistedSchemaVersion`, `category`, `outcome`, and `tags` fields. |
| Add minimal exact marker workflow docs. | Operators need the safe list -> copy durable `ev:` id -> add-command resolution path. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| `EVIDENCE.md` rewrite. | Rebuild model is not in scope. |
| `evidence rebuild` preview or execute. | T-0334 documents the boundary only. |
| Historical evidence migration. | Explicit non-goal for 0.3.2. |
| `check-id` / `subject` resolution. | Future semantic model. |
| `hadara.evidence.addCommand.v2` schema rename. | Separate API evolution. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-17 | Draft | Initial task scaffold. | task create |
| 2026-06-17 | In Progress | Started T-0333 from 0.3.2 capsule spec. | Required reading complete |
| 2026-06-17 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
