# T-0413 Installed-Package Recycle Script UX

## Metadata

| Field | Value |
|---|---|
| ID | T-0413 |
| Title | Installed-Package Recycle Script UX |
| Status | Done |
| Created | 2026-06-25 |
| Updated | 2026-06-25 |

## Goal

| Goal | Notes |
|---|---|
| Standardize post-publish installed-package recycle as a dry-run-first package command. | Adds a structured `hadara package recycle` report so release operators do not hand-stitch npm view/install/init/context/session smoke commands after publish. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara package recycle --json` dry-run planner. | Gives agents/operators a copyable, schema-valid checklist without network or install execution. |
| `hadara package recycle --execute ... --json` implementation. | Executes npm registry metadata reads, isolated-prefix install, installed CLI lifecycle/init/task/context/session smokes, and cleanup only when explicit. |
| Runtime schema, command registry, docs, and focused tests. | Keeps the new release-package surface discoverable and machine-readable. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish, dist-tag mutation, GitHub Release creation, Docker/PyPI publish. | Recycle validates a published package; it must not release or mutate external targets. |
| Full cross-platform installed-package matrix. | This capsule adds the standard command surface; broader OS matrix remains release-line validation scope. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-25 | Draft | Initial task scaffold. | TBD |
| 2026-06-25 | Ready for finalize | `hadara package recycle` implementation, schema/docs/tests, focused Docker validation, and built CLI dry-run smoke are complete. | ev:T-0413:db037677d84640d39722a7c7 |
| 2026-06-25 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
