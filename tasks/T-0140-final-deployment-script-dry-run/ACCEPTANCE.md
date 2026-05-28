# Acceptance Criteria

- [x] `hadara release dry-run --json` emits reduced schema-valid read-only release planning output.
- [x] Dry-run evidence checks require linked artifacts, schema validation, source/report ok, category/mode/result, package version, and release artifact manifest hash.
- [x] Release artifact execution can attach a reduced public `hadara.releaseArtifact.v1` evidence report with `--attach-evidence --task <task-id>`.
- [x] Tests and evidence are recorded.
- [x] Handoff is updated.
