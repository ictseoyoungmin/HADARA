# T-0253 Multi-Agent Command Context Contract

## Metadata

| Field | Value |
|---|---|
| ID | T-0253 |
| Title | Multi-Agent Command Context Contract |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Define Phase 6 common command context metadata. | Add actor/run context, plan context, next-action, write-boundary, role, and issue-code vocabulary without changing existing command behavior. |

## Scope

| In Scope | Reason |
|---|---|
| Core TypeScript types and helpers. | Future Phase 6 reports need shared actor/run/plan/next-action contracts. |
| Fixture-level JSON Schemas and registry entries. | External agents and future commands need stable schema ids before command-specific adoption. |
| Operator docs and schema docs. | CLI option names, write boundaries, and default actor semantics must be explicit. |
| Focused tests and Docker validation. | Proves defaults, vocabularies, and schema registration without changing runtime command behavior. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Adding actor CLI options to existing commands. | T-0253 is contract-only; command adoption starts in later Phase 6 capsules. |
| `task complete --execute` or shared-doc apply commands. | Execute orchestration is explicitly deferred by the Phase 6 spec. |
| Multi-agent scheduler, locks, assignment, or runtime. | Phase 6 establishes compatibility metadata, not a full runtime. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-05 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-05 | In Progress | Started Phase 6 common metadata contract implementation. | Phase 6 spec and focused schema tests |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |

