# T-0404 0.3.3 dogfood findings release hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0404 |
| Title | 0.3.3 dogfood findings release hardening |
| Status | Done |
| Created | 2026-06-22 |
| Updated | 2026-06-22 |

## Goal

| Goal | Notes |
|---|---|
| Harden 0.3.3 release findings from PatternForge dogfood | Import the dogfood findings/decision input and fix the two stable-release considerations PF-F-012 and PF-F-010. |

## Scope

| In Scope | Reason |
|---|---|
| PatternForge findings import | Preserve the dogfood findings and stable decision input inside this capsule. |
| PF-F-012 | Fix context pack/state projection Task Board row false warnings. |
| PF-F-010 | Fix post-close `task status` required next-action guidance for closed-valid tasks. |
| Validation | Add focused regression tests and run focused checks. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Public SaaS productization | PatternForge product gaps are not fixed in HADARA-dev. |
| 0.3.3 stable publish | This capsule hardens release blockers; publish readiness/publish remains a later capsule. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-22 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-22 | In Progress | Dogfood findings imported and hardening started. | T-0404 task docs |
| 2026-06-22 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
