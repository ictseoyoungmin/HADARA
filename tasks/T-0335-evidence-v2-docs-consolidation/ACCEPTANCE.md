# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Canonical/derived evidence boundary is consistent across docs. | Done | README, CLI JSON contract, workflow docs, generated init docs |
| AC-2 | Durable v2 id guidance is consistent. | Done | README, workflow docs, generated init docs, command registry |
| AC-3 | Legacy id caution is present. | Done | README, CLI JSON contract, workflow docs, generated init docs |
| AC-4 | Exact marker workflow is documented. | Done | README, workflow docs, generated init docs, command registry |
| AC-5 | Rebuild/check-id/subject/report-schema-v2 deferred items are clearly marked. | Done | README, CLI JSON contract, workflow docs, generated init docs, release notes/readiness |
| AC-6 | Generated docs tests pass. | Done | Docker full sync-build included `task-workflow-docs`, `command-registry`, and `init` tests. |
| AC-7 | Full validation passes if docs generation affects runtime output. | Done | Docker full sync-build passed 119 files / 791 tests with `distLooksStale:false`. |
