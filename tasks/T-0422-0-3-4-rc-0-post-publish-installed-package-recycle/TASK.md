# T-0422 0.3.4-rc.0 Post-Publish Installed-Package Recycle

## Metadata

| Field | Value |
|---|---|
| ID | T-0422 |
| Title | 0.3.4-rc.0 Post-Publish Installed-Package Recycle |
| Status | Done |
| Created | 2026-06-26 |
| Updated | 2026-06-26 |

## Goal

| Goal | Notes |
|---|---|
| Verify published `hadara@0.3.4-rc.0` from installed consumer paths before any stable `0.3.4` readiness decision. | Primary proof must come from registry-installed `hadara@next` in an isolated temporary prefix, not from the source checkout or workspace `dist`. |

## Scope

| In Scope | Reason |
|---|---|
| Verify npm registry version for `hadara@0.3.4-rc.0`. | Confirms the exact RC remains visible after T-0418 publish. |
| Verify npm dist-tags for `hadara`. | Confirms `next=0.3.4-rc.0` while `latest` remains the current stable package. |
| Install `hadara@next` into a disposable temporary prefix. | Proves consumer install behavior without relying on stale global or `npx` resolution. |
| Run installed CLI version, lifecycle help, fresh init, task lifecycle/finalize dry-run, context pack/slice, and session-start smokes. | Agent UX Hardening must prove installed agent-facing workflows, not only package metadata. |
| Record package recycle evidence and cleanup state. | Stable readiness decisions need durable proof and no leftover temp workspace requirement. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish, dist-tag mutation, or GitHub Release creation. | T-0418 already published the RC; this capsule is verification only. |
| Stable `0.3.4` publish or decision. | That decision depends on this installed-package recycle proof and belongs to a later capsule. |
| Source code changes. | The target behavior is the already published package. |
| Docker/PyPI/installer/MCP release mutation. | Deferred release targets remain outside this npm RC recycle. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-26 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-26 | In Progress | Started post-publish installed-package recycle for `hadara@0.3.4-rc.0` after reviewer direction. | T-0422 PLAN |
| 2026-06-26 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
