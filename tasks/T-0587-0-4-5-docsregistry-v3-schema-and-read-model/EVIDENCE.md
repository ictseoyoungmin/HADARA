# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0587:58d1d30360b44859ab835db6 | passed | validation | Validation "docsRegistry v3 read model compatibility" passed from direct result; Added docsRegistry v3 TypeScript/read-model compatibility: project.id/project.hadaraProfile types, origin/applicableProfiles fields, normalizeDocumentRegistryFile read path, v3 schema support in docs doctor/list, and tests proving v3 applicableProfiles normalize to internal profiles while existing invalid profiles remain diagnosed. Ran npm test -- tests/unit/docs-registry.test.ts, npm test -- tests/unit/init.test.ts, npm test -- tests/unit/docs-doctor.test.ts, npm run dev:docker-sync-build (153 files/1071 tests passed), and docs doctor --scope all returned ok:true clean.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0587:9e1b066c8321453daa598888 | passed | validation | Task finalize done-level readiness for T-0587 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:4f51065fbb68930129c6abbb9776edcbe88f857f3d09609efcaafb185d2972b5 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0587:a9af95d6288e4c339cd35742 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
