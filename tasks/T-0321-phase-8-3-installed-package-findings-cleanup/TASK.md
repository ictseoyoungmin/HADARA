# T-0321 Phase 8.3 Installed-Package Findings Cleanup

## Metadata

| Field | Value |
|---|---|
| ID | T-0321 |
| Title | Phase 8.3 Installed-Package Findings Cleanup |
| Status | Done |
| Created | 2026-06-15 |
| Updated | 2026-06-15 |

## Goal

| Goal | Notes |
|---|---|
| Resolve or reclassify T-0317 installed-package recycle findings before 0.3.1-rc1 readiness. | Exact `npx` should not be the only trusted consumer proof when PATH/global cache is stale; governed fresh docs doctor should not warn on historical default reading. |

## Scope

| In Scope | Reason |
|---|---|
| Document temp-prefix installed-bin validation as canonical consumer package proof when PATH may be stale. | Keeps installed-package recycle evidence reproducible without depending on external `npx` resolution behavior. |
| Fix or clarify governed generated docs doctor warnings. | Historical generated docs should not be treated as default Required Reading. |
| Add focused regression tests for fresh governed docs doctor and Required Reading behavior. | Prevents the T-0317 warning from returning. |
| Update shared state and handoff known-problem routing after cleanup. | Phase 8.4 should not inherit resolved findings. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish or release mutation. | Phase 8.3 is cleanup/readiness work only. |
| Network-dependent installed-package smoke as required close proof. | Network may be unavailable; record optional network failures honestly if attempted. |
| Replacing npm/npx behavior. | `npx` resolution and global cache behavior are external; HADARA should document the trustworthy proof path. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-15 | Draft | Initial task scaffold. | `task create` |
| 2026-06-15 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
