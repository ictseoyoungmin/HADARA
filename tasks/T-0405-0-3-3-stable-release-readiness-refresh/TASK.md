# T-0405 0.3.3 stable release readiness refresh

## Metadata

| Field | Value |
|---|---|
| ID | T-0405 |
| Title | 0.3.3 stable release readiness refresh |
| Status | In Progress |
| Created | 2026-06-22 |
| Updated | 2026-06-22 |

## Goal

| Goal | Notes |
|---|---|
| Prepare stable `hadara@0.3.3` source/readiness without publish mutation. | Promote the already published and dogfood-hardened rc line to stable source metadata and package-facing docs, then run release readiness validation. |

## Scope

| In Scope | Reason |
|---|---|
| Version metadata | Change source package metadata from `0.3.3-rc.0` to stable `0.3.3`. |
| Package-facing docs | Align README, release notes, and release readiness with stable `0.3.3` readiness. |
| Release validation | Run Docker/build/package/release gates appropriate for a no-publish readiness capsule. |
| Handoff/state docs | Route next work to approval-gated stable publish if readiness passes. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish or dist-tag mutation | Stable publish belongs to the next approval-gated capsule after readiness evidence is reviewed. |
| GitHub Release, Docker/PyPI publish, installer execution, MCP release/package execution | These remain explicit separate mutations. |
| PatternForge product work | Dogfood findings hardening was T-0404; SaaS product work stays outside HADARA-dev readiness. |

## Status

In Progress

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-22 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-22 | In Progress | Started stable `0.3.3` readiness refresh after T-0404 dogfood hardening. | T-0405 task docs |
<!-- hadara:managed:end task-status-history -->
