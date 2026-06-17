# T-0335 Evidence v2 Docs Consolidation

## Metadata

| Field | Value |
|---|---|
| ID | T-0335 |
| Title | Evidence v2 Docs Consolidation |
| Status | Done |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Consolidate Evidence v2 docs after T-0333 and T-0334. | Keep package-facing, generated, CLI, workflow, release, and deferred-scope guidance consistent before rc0 readiness. |

## Scope

| In Scope | Reason |
|---|---|
| Root README evidence guidance. | Package-facing guidance should be current. |
| `docs/CLI_JSON_CONTRACT.md`. | JSON consumers need field and deferred-scope expectations. |
| `docs/TASK_WORKFLOW_COMMANDS.md`. | Agents use this for lifecycle/evidence commands. |
| Generated init docs in `src/cli/init.ts`. | New projects need correct examples. |
| Command registry/help metadata. | Command surface should reflect options without implying deferred commands. |
| Release notes/readiness prep text. | 0.3.2 line needs clear narrative before T-0336. |
| Deferred scope guidance. | Avoid accidental implementation of rebuild/check-id/subject/report-schema-v2. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New runtime behavior. | T-0333/T-0334 handled behavior/boundary docs; this is consolidation. |
| Rebuild implementation. | Deferred by T-0334. |
| Migration. | Not part of 0.3.2 docs consolidation. |
| Version bump or release artifact generation. | T-0336 scope. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-17 | Draft | Initial task scaffold. | `task create` |
| 2026-06-17 | In Progress | Started Evidence v2 docs consolidation. | Required reading and T-0335 capsule spec |
| 2026-06-17 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
