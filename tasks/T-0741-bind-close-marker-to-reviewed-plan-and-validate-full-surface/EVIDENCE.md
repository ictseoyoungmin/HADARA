# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0741:9c82e4cdb2174cc8a3c2c0be | passed | validation | Validation "Focused transaction and argv tests" passed; failureClass: none; command: npx vitest run tests/unit/task-close.test.ts tests/unit/validation-run.test.ts tests/unit/command-registry.test.ts tests/unit/schema-fixtures.test.ts tests/unit/schema-runtime.test.ts --reporter=dot; argvHash: sha256:f4b34974f6ca049da59a1f10d3c9f0276525992ca07b963f95c2b555bcc1fa4c; exitCode: 0; signal: null; durationMs: 7290; stdoutHash: sha256:438ea013d1d965150e2926f88031c0916c8d91cf5b7409234a88c472a80b9374; stderrHash: sha256:1b865a631d7a2d4fc0ad18adc9ecd4d62c080f43661ded013cc3738ec3f27bfe |
| ev:T-0741:415cb1d782ee4e49a8cc96b3 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0741:5a4590fece4f41e9aa375056 | passed | validation | Validation "Full npm check" passed; failureClass: none; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 0; signal: null; durationMs: 38649; stdoutHash: sha256:370d70c60d236bd4394af60b85099da270b81800c13b01511d64d21eab73efa0; stderrHash: sha256:1b865a631d7a2d4fc0ad18adc9ecd4d62c080f43661ded013cc3738ec3f27bfe |
| ev:T-0741:c4ad7bbd70e8424d9b164659 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0741:31ffd54b946f4ed3a35b4d55 | passed | release | Host package smoke passed after Init v1 apply, doctor compatibility, and generated workflow contract alignment; this resolves prior package smoke failures. |
| ev:T-0741:4dfd673717354233a69ddb45 | passed | release | Resolve the historical package smoke failure projections with the host package smoke pass. |
| ev:T-0741:a104869b9d9f4219b83c8ae9 | passed | release | Host clean-checkout smoke passed after full npm check and built CLI gates; this resolves prior consumer smoke failures. |
| ev:T-0741:f9fed497e1974b39afa828ae | passed | validation | Task closePlan done-level readiness for T-0741 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:04104e339f729b332f9a93d08f5bf7fc2c662ed04c48b857ec871c456de96722 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0741:9b2c8f007afa4aa89fc2c655 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0741:b102de440e5442df9b46c215 | failed | Validation "Full npm check" failed; failureClass: assertion; command: npm run check; argvHash: sha256:698d6dd5422de2503349def717b72b78035aad247ef33cb92b78a6b2f2ca956a; exitCode: 1; signal: null; durationMs: 31204; stdoutHash: sha256:16b00a1e3597a782867fa03310bbfab5e8d943cc3d66c35509f08fcb378eb20c; stderrHash: sha256:3a3755ceb5bfa1ff7250938cc28aef57562027050f41428885763e50bc976c4c | Resolved | ev:T-0741:5a4590fece4f41e9aa375056 |
| ev:T-0741:2e59d414d1544554902b0587 | failed | Validation "Package smoke" failed; failureClass: assertion; command: node dist/cli/main.js smoke package --execute --source-root . --evidence-root . --smoke-project-root /tmp/hadara-t0741-package-smoke --json; argvHash: sha256:3a53d7b2a03e446e77804e11060c41440c347248c9c113244520593eeaf0455c; exitCode: 1; signal: null; durationMs: 50; stdoutHash: sha256:3c2c5fe41330974ffa76e98a310f4ada5c58274e7c6ba7ba7145eaec93ac8ba4; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0741:31ffd54b946f4ed3a35b4d55 |
| ev:T-0741:b4d64d8c66d646c69cd12ae8 | failed | Validation "Consumer clean-checkout smoke" failed; failureClass: assertion; command: node dist/cli/main.js smoke clean-checkout --execute --workspace /tmp/hadara-t0741-clean-checkout --json; argvHash: sha256:8f05e36542929ee87c16be091c4eeb96a6dd9f171585bfc88de9012d81ddd4cd; exitCode: 1; signal: null; durationMs: 53; stdoutHash: sha256:3c2c5fe41330974ffa76e98a310f4ada5c58274e7c6ba7ba7145eaec93ac8ba4; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0741:a104869b9d9f4219b83c8ae9 |
| ev:T-0741:fb833b588fda4f7983068292 | failed | Validation "Package smoke dev surface" failed; failureClass: assertion; command: node --import tsx tools/dev-surfaces.ts smoke package --execute --source-root . --evidence-root . --smoke-project-root /tmp/hadara-t0741-package-smoke-devsurface --json; argvHash: sha256:ba1d0b7dabcc4ec6990626a92736d4a33725ff85a9cafe82cba267a9515bf3b3; exitCode: 6; signal: null; durationMs: 3153; stdoutHash: sha256:e8f87e43c9a9834d2e00d94bba0a89b40492ee0913574a0386dfbff1d1035d4a; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0741:31ffd54b946f4ed3a35b4d55 |
| ev:T-0741:3a2c4244c8e54ff08a69c4b5 | failed | Validation "Consumer clean-checkout smoke dev surface" failed; failureClass: assertion; command: node --import tsx tools/dev-surfaces.ts smoke clean-checkout --execute --workspace /tmp/hadara-t0741-clean-checkout-devsurface --json; argvHash: sha256:90a194dbda2ac5294eade6388b5e2bf3e6576371628d1b321a08f63c9eca789b; exitCode: 6; signal: null; durationMs: 86411; stdoutHash: sha256:b763123b8c0a1c4ea4c70dcaa660b319ca4a0f80c499437dbd4228aeb7bb8739; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0741:a104869b9d9f4219b83c8ae9 |
| ev:T-0741:74258eaeb133470587b41c8d | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0741:4dfd673717354233a69ddb45 |
| ev:T-0741:d2191f0e677c4c039085a1e0 | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0741:4dfd673717354233a69ddb45 |
| ev:T-0741:ef6574e2b11347c09e8194db | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0741:4dfd673717354233a69ddb45 |
| ev:T-0741:a21d6d8aa254401594af1f81 | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0741:4dfd673717354233a69ddb45 |
| ev:T-0741:1f8946b37a134ec881a99dad | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0741:4dfd673717354233a69ddb45 |
| ev:T-0741:d310213dfe9a43f2bde92233 | failed | Package smoke local failed with reduced public evidence. | Resolved | ev:T-0741:4dfd673717354233a69ddb45 |
<!-- /hadara:slot -->
