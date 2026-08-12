# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0780:9b87c685bbb24c0489511132 | passed | validation | Validation "Package recycle terminal lifecycle tests" passed; failureClass: none; command: npx vitest run --config vitest.dev.config.ts tests/unit/package-recycle.test.ts; argvHash: sha256:7c9d523ee411ad6aa76c8154e8dfbb903eb294cf3ea549e7c86396c412ba6d67; exitCode: 0; signal: null; durationMs: 6262; stdoutHash: sha256:c764c99b8c26f500266c3c123e0f67a194d7ea0e846fe7accc8b9e0017aaaca1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0780:afb1645a283c44bc9d177f70 | passed | validation | Validation "Schema fixtures and source/tools typechecks" passed; failureClass: none; command: bash -lc npm run typecheck:src && npm run typecheck:tools && npm run test:focused -- tests/unit/schema-fixtures.test.ts; argvHash: sha256:1498210db60d853bf69e053ba759acc8f0a709b67f310ab7b7ffdc0c3a322790; exitCode: 0; signal: null; durationMs: 13491; stdoutHash: sha256:86d263c65aee510e58c880173a72e8c178fff028683c301410ab02fc965125dd; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0780:4487dbadfedb4947bdb7a4cd | passed | validation | Validation "Docker sync build" passed from direct result; npm run dev:docker-sync-build passed; Docker build completed, dist synchronized, built CLI version smoke reported distLooksStale=false.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0780:b010c939657b485f8ffda7de | passed | validation | Task closePlan done-level readiness for T-0780 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:5c404c28a18ebf748fff26df6d09e273a2765bd0b816e77edc1de1dce40a9de2 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0780:2c47936fa80f481983d0a6a7 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
