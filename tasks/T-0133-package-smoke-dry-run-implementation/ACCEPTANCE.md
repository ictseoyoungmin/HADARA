# Acceptance Criteria

- [x] `hadara package smoke --dry-run --json` emits a schema-valid `hadara.packageSmoke.v1` report.
- [x] Report previews workspace, source, planned steps, artifacts, and issues.
- [x] Dry-run report keeps `npmPackExecuted`, `packageInstallExecuted`, `featureSmokeExecuted`, `releaseMutationExecuted`, and `publishExecuted` false.
- [x] Public output redacts absolute source/workspace paths and omits raw package content, raw npm logs, env secrets, private paths, and private store paths.
- [x] No package artifact, install tree, evidence, release artifact, publish, GitHub Release, Docker image, MCP write surface, provider call, or subprocess execution is added.
- [x] T-0131 service/read-model smoke boundary is documented separately from future installed CLI/package smoke execution.
- [x] Evidence is attached.
- [x] Handoff is updated.
