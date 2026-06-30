# T-0430 T-04A4 Docs Registry Storage and Register Surface

## Metadata

| Field | Value |
|---|---|
| ID | T-0430 |
| Title | T-04A4 Docs Registry Storage and Register Surface |
| Status | Done |
| Created | 2026-06-30 |
| Updated | 2026-06-30 |

## Goal

| Goal | Notes |
|---|---|
| Implement the 0.4 registry-first document registration surface. | `hadara docs register` should write `.hadara/docs-registry.json` and avoid mutating AGENTS/context/workflow prose. |

## Scope

| In Scope | Reason |
|---|---|
| Add `hadara docs register --path <path> --json`. | Required by the accepted 0.4 workflow docs and T-04A4 worker plan. |
| Store registrations in `.hadara/docs-registry.json`. | The JSON registry is the canonical document metadata store. |
| Register command/schema metadata and focused tests. | External agents need discoverable JSON contracts and command inventory coverage. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Implement `docs read-map`, `docs inbox`, `docs complete-spec`, or `docs mark-drift`. | These are later 0.4 surfaces. |
| Reintroduce generated Required Reading rows into prose docs. | 0.4 keeps AGENTS/context/workflow responsibilities separate from registry storage. |
| Release, publish, package, installer, or external mutation work. | Release-line work is explicitly out of this 0.4 implementation capsule. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-30 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-30 | In Progress | Implemented docs registry registration surface and validation. | `ev:T-0430:1933b10f80184f8abb9540cb` |
| 2026-06-30 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
