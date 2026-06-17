# T-0338 0.3.2-rc.0 Post-Publish Installed-Package Recycle

## Metadata

| Field | Value |
|---|---|
| ID | T-0338 |
| Title | 0.3.2-rc.0 Post-Publish Installed-Package Recycle |
| Status | Done |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Verify the published `hadara@0.3.2-rc.0` package from consumer install paths. | Primary proof must come from temp-prefix installed bin, not source checkout. |

## Scope

| In Scope | Reason |
|---|---|
| Registry metadata and npm dist-tag verification. | Confirm package visibility and tag state after T-0337 publish. |
| Temp-prefix install and installed `hadara version --json`. | Primary installed-package proof. |
| Installed `evidence list` text and JSON checks. | Verify Evidence v2 id/category/outcome UX from package. |
| Installed exact `--resolves ev:` workflow smoke. | Verify durable id resolution workflow from package. |
| Fresh init docs surface and disposable lifecycle smoke. | Verify package-facing protocol workflow. |
| Temp folder cleanup and findings documentation. | Keep recycle artifacts disposable and actionable. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish. | Completed in T-0337. |
| GitHub Release creation. | Explicit-request only and out of recycle scope. |
| Docker/PyPI publish. | Deferred release targets. |
| Source-checkout-only proof as primary evidence. | T-0338 requires installed package proof. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-17 | Draft | Initial task scaffold for post-publish recycle. | T-0337 handoff |
| 2026-06-17 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
