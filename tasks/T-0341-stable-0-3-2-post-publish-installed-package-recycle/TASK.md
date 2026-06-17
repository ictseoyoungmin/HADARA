# T-0341 Stable 0.3.2 Post-Publish Installed-Package Recycle

## Metadata

| Field | Value |
|---|---|
| ID | T-0341 |
| Title | Stable 0.3.2 Post-Publish Installed-Package Recycle |
| Status | Done |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Verify published stable `hadara@0.3.2` from installed consumer paths after T-0340 npm publish. | Primary proof must come from `hadara@latest` or exact `hadara@0.3.2` installed into a disposable temp prefix, not from the source checkout. |

## Scope

| In Scope | Reason |
|---|---|
| Verify npm registry metadata and dist-tags for `hadara@0.3.2`. | Confirms stable package visibility and `latest=0.3.2` while preserving `next=0.3.2-rc.0`. |
| Install `hadara@latest` into a disposable temp prefix and run installed `hadara version --json`. | Proves consumer path resolves stable `0.3.2` and `distLooksStale:false`. |
| Run installed Evidence v2 list and exact resolution smoke. | Repeats T-0338 installed-package recycle for the stable package line. |
| Run installed fresh governed init and minimal lifecycle smoke. | Confirms package-facing workflow surfaces work after stable publish. |
| Remove disposable temp directories and document findings. | Keeps recycle artifacts outside the repository and records any residual risk. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish, dist-tag mutation, or GitHub Release creation. | Completed or explicitly skipped in T-0340; this task is verification only. |
| Source implementation changes. | Stable package behavior should be verified from the npm-installed package. |
| Docker, PyPI, installer, or MCP release mutation. | Deferred release targets remain outside this recycle. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-17T13:48:00Z | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-17T13:49:00Z | In Progress | Started stable installed-package recycle after T-0340 publish and reviewer direction. | T-0341 PLAN |
| 2026-06-17T14:03:00Z | Done | Stable `0.3.2` installed-package recycle passed and close-source docs were updated. | `ev:T-0341:3208efa9002b47cc8ea68363` |
<!-- hadara:managed:end task-status-history -->
