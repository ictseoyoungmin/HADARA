# T-0302 0.3.0-rc.1 post-publish installed-package recycle

## Metadata

| Field | Value |
|---|---|
| ID | T-0302 |
| Title | 0.3.0-rc.1 post-publish installed-package recycle |
| Status | Done |
| Created | 2026-06-12 |
| Updated | 2026-06-12 |

## Goal

| Goal | Notes |
|---|---|
| Validate the published `hadara@0.3.0-rc.1` package from npm in a clean recycle environment. | Use `hadara-recycle` and `/tmp/hadara-recycle/0.3.0-rc.1/` to exercise registry metadata, install/npx/global usage, fresh init profiles, protocol migration, lifecycle commands, and a 10-capsule small dogfooding project. |

## Scope

| In Scope | Reason |
|---|---|
| npm registry metadata checks | Confirm version, time, dist-tags, description, keywords, repository, homepage, and bugs for `hadara@0.3.0-rc.1`. |
| Installed package smoke | Run npx and global install smokes from a clean temp workspace. |
| Fresh init profile recycle | Exercise basic, standard, and governed profiles plus docs surfaces. |
| Protocol migration recycle | Exercise `protocol migrate --target 0.3.0` dry-run/execute on a generated project. |
| Lifecycle recycle | Exercise task create/status/evidence/finish/ready/close/audit. |
| Ten-capsule dogfooding project | Create a small project useful to HADARA development and run 10 HADARA workflow capsules to evaluate bugs/friction. |
| Findings | Record observed issues, limits, and recommendations. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish or package mutation | rc.1 is already published; this capsule is read/install/use validation only. |
| GitHub Release creation | Optional release target remains deferred unless explicitly requested. |
| Docker image/PyPI/installer publishing | Deferred release targets. |
| Fixing newly found bugs | Findings are recorded; fixes should get separate capsules unless tiny doc corrections are needed for this recycle. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-12 | Draft | Initial task scaffold. | Created by `hadara task create`. |
| 2026-06-12 | In Progress | Running post-publish installed-package recycle for `hadara@0.3.0-rc.1`. | T-0302 capsule docs updated. |
| 2026-06-12 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
