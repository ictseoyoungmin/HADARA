# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0766:4ac86259ec064b47aa7b7fd4 | passed | validation | Validation "Init v1 and protocol consistency focused tests after managed-block correction" passed; command: ./node_modules/.bin/vitest run tests/unit/init-v1-model.test.ts tests/unit/protocol-consistency.test.ts tests/unit/init-v1-planner.test.ts tests/unit/init-v1-upgrade.test.ts tests/unit/init-v1-transaction.test.ts; exitCode: 0; signal: null; durationMs: 9660; stdoutHash: sha256:3ab4f023b16bc68cb7dd7a36eaaa9844127253d2d7adf935885ca153c9d7c863; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0766:5122cc1df88b4ff5bb5811b7 | passed | validation | Fresh built RC4 CLI dogfood passed for minimal, standard, and governed presets: init doctor and docs doctor clean; protocol doctor error and warning counts are zero. |
| ev:T-0766:18de2c638b5140dfb354d2c7 | passed | validation | Validation "Focused Init v1 and protocol consistency regressions" passed; command: ./node_modules/.bin/vitest run tests/unit/init-v1-model.test.ts tests/unit/protocol-consistency.test.ts tests/unit/init-v1-planner.test.ts tests/unit/init-v1-upgrade.test.ts tests/unit/init-v1-transaction.test.ts; exitCode: 0; signal: null; durationMs: 11792; stdoutHash: sha256:12586549d66a64b097ad2503116628a885f1d2013a2d162f86a155133b977dee; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0766:564f2453d3614190b780ec1a | passed | validation | Validation "Final full repository check after scaffold reconciliation" passed; command: npm run check; exitCode: 0; signal: null; durationMs: 40702; stdoutHash: sha256:0b94ea6508878182e212d28f3d170e28ba5bc838436990cf2a87871484f2266b; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0766:1aab3d3d77f44075a346fbcf | passed | validation | Final successful focused regressions and npm run check supersede earlier failed attempts after preserving the Init v1 managed block, correcting minimal Required Reading, and fixing the template context reference. |
| ev:T-0766:c42a79f553f4448bab419203 | passed | validation | Task finalize done-level readiness for T-0766 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:086f774f0fe867b15ac2f1b3c2e43393fa04ecdcb31f5698df58897ea6e3a4f4 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0766:b0cafc1d544447ce984e6f46 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0766:3d05d2d013a14aa587194024 | failed | Validation "Init v1 and protocol consistency focused tests" failed; command: npm run test:unit -- tests/unit/init-v1-model.test.ts tests/unit/protocol-consistency.test.ts; exitCode: 1; signal: null; durationMs: 19958; stdoutHash: sha256:c3a5fd6630fcb62a3e6fcdab18fbbb96b25e2b4c5c22df5a934ab423ffa9fdb4; stderrHash: sha256:e90203e65503410672bb8d1a58f51d07ce77299415213d917835afa88df35765 | Resolved | ev:T-0766:1aab3d3d77f44075a346fbcf |
| ev:T-0766:d10b2ea957574451b000f7e8 | failed | Validation "Build current RC4 CLI" failed; command: npm run build; exitCode: 2; signal: null; durationMs: 8047; stdoutHash: sha256:2156c1cbe561c6145968a2019e08ad092abc0b116c2a6b5cd744a39a0cbd57c1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0766:1aab3d3d77f44075a346fbcf |
| ev:T-0766:59a385320d0b4630a45ae50e | failed | Validation "Rebuild current RC4 CLI after minimal scaffold fix" failed; command: npm run build; exitCode: 2; signal: null; durationMs: 6820; stdoutHash: sha256:2156c1cbe561c6145968a2019e08ad092abc0b116c2a6b5cd744a39a0cbd57c1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0766:1aab3d3d77f44075a346fbcf |
| ev:T-0766:2708d4a31a414fc199ada9a4 | failed | Validation "Full repository check" failed; command: npm run check; exitCode: 2; signal: null; durationMs: 9790; stdoutHash: sha256:c31d7452fd47cc8506a5e4b437df2ac9eb7fe6a16d821ccb575120af4c3f1c98; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0766:1aab3d3d77f44075a346fbcf |
<!-- /hadara:slot -->
