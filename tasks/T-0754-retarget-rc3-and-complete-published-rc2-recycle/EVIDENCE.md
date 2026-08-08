# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0754:6e8cdb575d774834b9c9983f | passed | release | Installed-package recycle passed with reduced public evidence. |
| ev:T-0754:c61de5486a274f649bea2b9f | passed | validation | Validation "Full npm check" passed; failureClass: none; command: npm run check --json; argvHash: sha256:6a88b645ea53e5b692b581e93f51d0d9034ffe462c63d4de26330d557a706e7f; exitCode: 0; signal: null; durationMs: 48657; stdoutHash: sha256:89a0ff047bc2f581faad5e9922abf49684cceacc2ea9ff9365b4acc95f38e1ad; stderrHash: sha256:655ddb92aecd8e3cefb824558ff68a634fbd0d49cd1761e255c9a1da4beb8459 |
| ev:T-0754:efb7ec1921db4937819a1660 | passed | release | Installed hadara@next RC2 recycle rerun passed after reviewed init apply and compact close-report compatibility fixes; resolves prior failed recycle attempts. |
| ev:T-0754:40ee5d5caa91445692eec4ec | passed | validation | Validation "RC3 provenance and package recycle unit tests" passed; failureClass: none; command: npx vitest run --config vitest.dev.config.ts tests/unit/manual-publish-script.test.ts tests/unit/release-dry-run.test.ts tests/unit/package-recycle.test.ts; argvHash: sha256:d1ec41baedfdc1ae0dc69408d2e3439fcde6ec5a07440da06b641da95053502f; exitCode: 0; signal: null; durationMs: 3226; stdoutHash: sha256:3b71a39bf568bc5194b741647da2d917321b59360065c5b1581cf2ee226b97b1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0754:ef71628cd6ba40e095f52cec | passed | validation | Built CLI reports packageVersion 0.5.0-rc.3 and dist is current after the source retarget. |
| ev:T-0754:fb343c4bbc0c498fbc66b3aa | passed | release | Observed public v0.5.0-rc.2 GitHub prerelease with zero assets; exact original tarball unavailable, so no fabricated upload was made. |
| ev:T-0754:2b34d21040a7409fb9fb9a3f | passed | validation | Task closePlan done-level readiness for T-0754 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:2cff3673a348899bc94dc6dbba86003c245aefbff694ea116b6db0be0ecdf1af |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0754:6dc1d4a337154532a600a6d1 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0754:46098a50ee664e4eac47be47 | failed | Installed-package recycle failed with reduced public evidence. | Resolved | ev:T-0754:efb7ec1921db4937819a1660 |
| ev:T-0754:832b321617a44ca9993bdf3a | failed | Installed-package recycle failed with reduced public evidence. | Resolved | ev:T-0754:efb7ec1921db4937819a1660 |
<!-- /hadara:slot -->
