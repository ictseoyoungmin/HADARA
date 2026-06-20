# T-0401 0.3.3-rc.0 Release Readiness Preparation

## Metadata

| Field | Value |
|---|---|
| ID | T-0401 |
| Title | 0.3.3-rc.0 Release Readiness Preparation |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.3.3-rc.0` source/readiness without publish mutation. | Release readiness only; approval-gated publish remains a separate capsule. |

## Scope

| In Scope | Reason |
|---|---|
| Version bump to `0.3.3-rc.0`. | Release candidate source metadata. |
| Package lock/metadata alignment. | Package consistency. |
| README release status update. | Package-facing candidate guidance. |
| `docs/RELEASE_NOTES.md` and `docs/RELEASE_READINESS.md` updates. | Release narrative/readiness source. |
| Release artifact, package smoke, clean-checkout smoke. | Release evidence gates. |
| Strict release gate, release dry-run, publish dry-run. | Read-only release readiness gates and no-mutation proof. |
| Full Docker validation and `git diff --check`. | Source/test/dist freshness and whitespace. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish. | Approval-gated publish belongs to the next capsule. |
| GitHub Release creation. | Explicit operator request only. |
| Docker/PyPI publish. | Deferred release targets. |
| Installer execution. | Out of release-readiness scope. |
| MCP release/package execution. | Out of release-readiness scope. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Initial task scaffold. | `task create` |
| 2026-06-20 | In Progress | Started 0.3.3-rc.0 release readiness preparation. | Required reading and T-0401 capsule spec |
| 2026-06-20 | Done | Prepared `hadara@0.3.3-rc.0` source/readiness and passed release readiness gates without publish mutation. | ev:T-0401:1046d97d72a54ca6bd9dabf3, ev:T-0401:125c51d2304a4d689c957bab, ev:T-0401:698672f04c9e4ba394e616c2, ev:T-0401:211f174377cf41eaba9f707b, ev:T-0401:34875afe7c1c4a6c802a0a0d |
<!-- hadara:managed:end task-status-history -->
