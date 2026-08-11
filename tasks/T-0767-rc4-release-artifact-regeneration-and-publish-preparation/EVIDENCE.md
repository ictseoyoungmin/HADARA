# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0767:21beb4b802514c0abc8d8a58 | passed | validation | npm run check passed after retargeting source metadata to 0.5.0-rc.4: build, tools typecheck, 128 unit files with 1031 tests, and 16 development test files with 136 tests. |
| ev:T-0767:70deec0c6378466ab43fa101 | passed | validation | Validation "Release artifact JSON child-version compatibility regression with development test config" passed; command: ./node_modules/.bin/vitest run --config vitest.dev.config.ts tests/unit/release-artifact.test.ts; exitCode: 0; signal: null; durationMs: 4168; stdoutHash: sha256:34adcfa6a2514695c3dcc69a7c2c3119dacc8168ebf4512bd2338c93eab1949d; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0767:623ede5e563b43a4b887081e | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0767:aef6d7be85d94839ba0d9399 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0767:cdac888ca0fd49308b8dc666 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0767:239506a239ed460d85ac3c59 | passed | release | Final RC4 release readiness passed: strict gate, release dry-run, and publish dry-run all passed with no npm, GitHub, Docker, or registry mutation; package and clean-checkout evidence are current and tarball provenance matches. |
| ev:T-0767:a9e04e2c41144445853e02cb | passed | validation | Task finalize done-level readiness for T-0767 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:8782d5ac06afccad8a959948f932035fc2efc6f7f29fba67a24f00264b08e0a2 |
| ev:T-0767:9f8415a89a29412595ce2ca5 | passed | validation | Task closePlan done-level readiness for T-0767 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:59e240d4bc99a351acaea6afc3dd04c8598399c366e16a1a4a32f5322f9af706 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0767:362d88fd6a9d4ee5a3ea14d5 |
| close evidence | passed | ev:T-0767:f2dc3560ab5c4de6ae066717 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0767:06ad0972f50f44489886b75b | failed | Initial clean-clone release artifact attempt failed before execution because the disposable source clone had no installed tsx dependency; no artifact or source mutation occurred. | Resolved | ev:T-0767:239506a239ed460d85ac3c59 |
| ev:T-0767:160331adaca8490e8ca01daf | failed | Clean-source RC4 artifact build reached source compilation but failed built CLI version verification because the release-artifact runner compared JSON-formatted child version output as plain text; no package artifact was staged. | Resolved | ev:T-0767:239506a239ed460d85ac3c59 |
| ev:T-0767:93f12b8764964dc99a91e7e3 | failed | Validation "Release artifact JSON child-version compatibility regression" failed; command: ./node_modules/.bin/vitest run tests/unit/release-artifact.test.ts; exitCode: 1; signal: null; durationMs: 646; stdoutHash: sha256:3e23d28c50a503a4d39ea08f2ca3cb865f08e95b1a12da40478611ea3bc9a478; stderrHash: sha256:31dcf9d9e9681343f1b7c1fd03c64c05eda05a719c5192c62ebb383b08800cc7 | Resolved | ev:T-0767:239506a239ed460d85ac3c59 |
<!-- /hadara:slot -->
