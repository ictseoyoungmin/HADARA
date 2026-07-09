# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0552:f32bf15e94a04cc8bf897923 | passed | validation | Validation "Focused context cache tests" passed from direct result; Focused cache/source-manifest/schema validation passed: Vitest 3 files / 26 tests; local TypeScript build passed. Tests cover warm execute post-write freshness fields and source manifest fast-freshness behavior.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0552:ec0b91ff9cf741068157ca91 | passed | validation | Validation "Docker sync-build and TypeScript build" passed from direct result; Docker sync-build passed npm ci, TypeScript build, full Vitest 148 files / 1021 tests, refreshed workspace dist, and reported distLooksStale:false.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0552:6c73cf25a3a34fce98a23bf8 | passed | validation | Validation "Built cache warm/status/context-pack smoke" passed from direct result; Built CLI smoke passed: stale warm execute exposed postWriteCacheFresh=true and after.cacheFresh=true before final Docker build; final built cache status returned mode=hit, cacheFresh=true, fastPath=hit, staleExtractorKeys=[], 5 fresh shards; context pack for T-0552 returned ok:true, graph-core cache hit, staleShardCount=0, and sourceManifestFastPath=hit.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0552:457366b912c14427b6866e36 | passed | validation | Task finalize done-level readiness for T-0552 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:cb2fab1a578f635b945935e1ea633e764e65bac3f34199674916e45c78cd332a |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0552:5afaa2d8aca54845a5930194 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
