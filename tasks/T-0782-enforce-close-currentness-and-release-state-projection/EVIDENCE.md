# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0782:f2d33304851946f289a4f4b6 | passed | validation | Validation "HANDOFF close-currentness tests" passed; failureClass: none; command: npx vitest run tests/unit/task-validation.test.ts tests/unit/task-selection-continuation.test.ts; argvHash: sha256:91a0b8e417b39a8f4daadb0f53ea80e18b2771bb26fb97f19f9e53f62ab7603b; exitCode: 0; signal: null; durationMs: 2366; stdoutHash: sha256:300b64b3ab6bac7c8cd6a1ab4b60ad7ef2d9c485312c731befc8fca97d460084; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0782:e8a128228ced4d93b5e261fd | passed | validation | Validation "Release current-state projection tests" passed; failureClass: none; command: npx vitest run --config vitest.dev.config.ts tests/unit/release-current-state.test.ts; argvHash: sha256:5d1ae8e881027a0bc4a069c06d9fd8121c5d8d244aabd689f8ba89b650936a68; exitCode: 0; signal: null; durationMs: 1819; stdoutHash: sha256:ec7366e74bf97a47f08b35c12ef9c1d3a0d775fb22f4fa26a6a9398acc2cfa4e; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0782:d0d85b36a3a64eea8d5ce2b3 | passed | validation | Validation "Full default and HADARA-dev tests" passed; failureClass: none; command: bash -lc npm test && npm run test:hadara-dev; argvHash: sha256:d10f9a41b3eedede63cea24964e0fee6547354718508eda47f95143ecab57396; exitCode: 0; signal: null; durationMs: 23487; stdoutHash: sha256:6aaaa33db3d1ecd296fa6b4c391e224a2978432d732e5429cf1f9bd62aad3d8e; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0782:71a7eb7c034744018d58d286 | passed | validation | Validation "Source/tools typechecks and Docker sync build" passed from direct result; Source and tools typechecks passed; npm run dev:docker-sync-build passed, synchronized dist, and built CLI smoke reported distLooksStale=false.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0782:63b884e61ab34c93ac98d167 | passed | validation | Validation "Release current-state repository dogfood" passed; failureClass: none; command: node --import tsx tools/dev-surfaces.ts release current-state --json; argvHash: sha256:3f60665611172a0acfdf7985f37814e32dd326c73540b8729c0cf350c09fb6c2; exitCode: 0; signal: null; durationMs: 543; stdoutHash: sha256:22d1d0d4f466a82954e00b49d4dc6103085e8260dc0fb467408a003b4c2bc9e9; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0782:cc9b6e86ca744273b3e2bece | passed | validation | Validation "Final Docker sync build" passed from direct result; Final npm run dev:docker-sync-build passed after registered public-verification schema and compatible-version reducer; dist synchronized and built CLI reported distLooksStale=false.; failureClass: none; command: direct-result; argvHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0782:44f004ae520240628ad12d25 | passed | validation | Validation "Final suite after typed verification registration" passed; failureClass: none; command: bash -lc npm test && npm run test:hadara-dev; argvHash: sha256:d10f9a41b3eedede63cea24964e0fee6547354718508eda47f95143ecab57396; exitCode: 0; signal: null; durationMs: 23400; stdoutHash: sha256:dc7d6c729ddc8d996b4802b18410593400a6ac8dc3a905f2b31d4ef2120f37e5; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0782:0211cbe8f0304d34b0676501 | passed | validation | Task closePlan done-level readiness for T-0782 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:02b35ff50cee55a2e48039d6d8a48f7d591953a41e8abb18588835868dbe844c |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0782:94fd5d012fe140d1b23c38ce |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
