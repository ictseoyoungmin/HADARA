# T-0337 0.3.2-rc.0 Approval-Gated Publish

## Metadata

| Field | Value |
|---|---|
| ID | T-0337 |
| Title | 0.3.2-rc.0 Approval-Gated Publish |
| Status | Done |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Publish `hadara@0.3.2-rc.0` through the approval-gated npm helper. | Requires explicit operator confirmation and npm authentication before publish mutation. |

## Scope

| In Scope | Reason |
|---|---|
| Run or hand off the manual publish helper. | Primary T-0337 publish path. |
| Publish to npm with dist-tag `next`. | Release-candidate packages must not replace stable `latest`. |
| Verify npm registry visibility for `hadara@0.3.2-rc.0`. | AC-2. |
| Verify tarball, README, package metadata, and dist-tags. | AC-3 through AC-5. |
| Update release readiness, evidence, and handoff after operator execution. | Required for T-0338 recycle handoff. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Installed-package recycle. | Owned by T-0338. |
| GitHub Release creation. | Optional only if explicitly requested. |
| Docker/PyPI publish. | Deferred release targets. |
| Installer execution. | Out of release publish scope. |
| MCP release/package execution. | Out of release publish scope. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-17 | Draft | Initial task scaffold. | `task create` |
| 2026-06-17 | In Progress | Started approval-gated npm publish capsule and documented operator handoff boundary. | Required reading and T-0337 capsule spec |
| 2026-06-17 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
