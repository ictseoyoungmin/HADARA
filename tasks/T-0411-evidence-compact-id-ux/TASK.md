# T-0411 Evidence Compact ID UX

## Metadata

| Field | Value |
|---|---|
| ID | T-0411 |
| Title | Evidence Compact ID UX |
| Status | Done |
| Created | 2026-06-25 |
| Updated | 2026-06-25 |

## Goal

| Goal | Notes |
|---|---|
| Add compact evidence id summary. | Agents can quickly copy durable `ev:` ids, identify latest validation evidence, and find close evidence without scanning verbose JSON. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara evidence summary --task <task-id> --json`. | Implements 0.3.4 Workstream C as a read-only convenience surface. |
| Compact schema, CLI docs, registry, and focused tests. | Keeps the command discoverable and contract-backed. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Evidence append semantics or `EVIDENCE.md` rewrite. | This is id discovery only. |
| Replacing `evidence list`. | Existing detailed list compatibility remains intact. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-25T05:00:00.000Z | Draft | Initial task scaffold. | Task create. |
| 2026-06-25T05:05:00.000Z | In Progress | Implement compact evidence summary as read-only additive command. | `docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md` |
| 2026-06-25T05:07:00.000Z | Done | Implemented and validated compact evidence id UX. | `ev:T-0411:0072b5ef53bb42378fe5c58b` |
<!-- hadara:managed:end task-status-history -->
