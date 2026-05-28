# Risks

| Risk | Mitigation |
|---|---|
| Smoke runner accidentally becomes package/install execution. | The implemented `core` profile calls existing read-model/report builders only and does not run subprocesses, installers, package smoke, or artifact writes. |
| Public smoke output leaks raw paths or large logs. | The report stores only reduced step ids, command labels, schema ids, status, and summaries; tests assert the project root does not appear in JSON. |
| `release-readiness` profile is mistaken for implemented release proof. | The profile is reserved but returns `FEATURE_SMOKE_PROFILE_DEFERRED` with exit code 6 through the CLI. |
| Schema drifts from report shape. | `createFeatureSmokeReport()` asserts `hadara.featureSmoke.v1`, and schema runtime/fixture tests cover the report. |
