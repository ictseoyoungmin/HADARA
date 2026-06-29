# T-0424 0.4 Spec Finalization and Canonicalization

## Metadata

| Field | Value |
|---|---|
| ID | T-0424 |
| Title | 0.4 Spec Finalization and Canonicalization |
| Status | Done |
| Created | 2026-06-29 |
| Updated | 2026-06-29 |

## Goal

| Goal | Notes |
|---|---|
| Finalize the HADARA 0.4 productization redesign specs and make their canonical file layout easy to register in a later capsule. | Treat T-0424 as T-04A0: spec design/canonicalization only, not implementation or docs registry registration. |

## Scope

| In Scope | Reason |
|---|---|
| Refine the 0.4 specs as a generalized HADARA product design, not a HADARA-dev-specific scaffold. | Product defaults must work for ordinary HADARA projects. |
| Move the nested 0.4 spec package into a clean canonical `docs/specs/0.4.0/productization-redesign/` layout. | Later registration capsules should not depend on duplicated archive-style paths. |
| Clarify authoring ownership in `docs/HADARA_WORKFLOW.md` and related specs without duplicating long instructions inside every Task Capsule. | Avoid per-capsule boilerplate while keeping agent/CLI responsibilities clear. |
| Decide and document evidence projection, task-local handoff close-source behavior, legacy boundaries, and T-04A capsule sequence. | These are design blockers before implementation capsules start. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Registering 0.4 specs in Required Reading, docs registry, or SOP. | The operator explicitly deferred registration until capsule implementation starts. |
| Changing HADARA CLI behavior, generated init output, task create output, validators, or release metadata. | This capsule is design/spec finalization only. |
| Publishing, package readiness, or stable 0.3.4 release work. | Separate release-line capsules own those workflows. |
| Migrating existing 0.3.x projects to 0.4. | 0.4 remains a breaking new-project protocol line. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-29 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-29 | In Progress | Started T-04A0 spec finalization and canonicalization after product-design review. | T-0424 plan |
| 2026-06-29 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
