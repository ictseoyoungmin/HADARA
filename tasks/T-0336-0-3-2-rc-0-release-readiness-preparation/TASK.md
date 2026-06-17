# T-0336 0.3.2-rc.0 Release Readiness Preparation

## Metadata

| Field | Value |
|---|---|
| ID | T-0336 |
| Title | 0.3.2-rc.0 Release Readiness Preparation |
| Status | In Progress |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.3.2-rc.0` source/readiness without publish mutation. | Release readiness only; approval-gated publish remains T-0337. |

## Scope

| In Scope | Reason |
|---|---|
| Version bump to `0.3.2-rc.0`. | AC-1. |
| Package lock/metadata alignment. | Release package consistency. |
| README release status update. | Package-facing candidate guidance. |
| `docs/RELEASE_NOTES.md` and `docs/RELEASE_READINESS.md` updates. | Release narrative/readiness source. |
| Release artifact, package smoke, clean-checkout smoke. | Release evidence gates. |
| Strict release gate, release dry-run, publish dry-run. | Read-only release readiness gates. |
| Full Docker validation and `git diff --check`. | Source/test/dist freshness and whitespace. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish. | T-0337 approval-gated publish scope. |
| GitHub Release creation. | Explicit operator request only. |
| Docker/PyPI publish. | Deferred release targets. |
| Installer execution. | Out of release-readiness scope. |
| MCP release/package execution. | Out of release-readiness scope. |

## Status

In Progress

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-17 | Draft | Initial task scaffold. | `task create` |
| 2026-06-17 | In Progress | Started 0.3.2-rc.0 release readiness preparation. | Required reading and T-0336 capsule spec |
<!-- hadara:managed:end task-status-history -->
