# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0454:385fa69b38dc4641839a69bb | passed | validation | Validation "Dogfood auto-resolution probe" passed; command: node -e process.exit(0); exitCode: 0; signal: null; durationMs: 31; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0454:10fe55713fac48b2907d76b6 | passed | validation | Validation "Focused validation-run tests" passed; command: bash -lc cd /tmp/hadara && npx vitest run tests/unit/validation-run.test.ts; exitCode: 0; signal: null; durationMs: 2655; stdoutHash: sha256:2d4d862dd2fea0250eaf79fb2934b601e0b616dd9e1b885c6957fab70cc2428a; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0454:0287e6d080ec411880afc44b | passed | validation | Validation "TypeScript build" passed; command: bash -lc cd /tmp/hadara && npm run build; exitCode: 0; signal: null; durationMs: 5700; stdoutHash: sha256:692cfda59649251706a4488585066790f572450b0eb37df66f9dcd284492dfb1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0454:602ec6f3079b4f3eae6c509a | unknown | operation | Command completed. |
| ev:T-0454:fe8b5a505bd94cbaa6805dc4 | passed | validation | Direct done-level harness validation passed after validation-run nested spawn was blocked; command: node dist/cli/main.js harness validate --task T-0454 --level done --json; result: ok true |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0454:03a226eea57e4111ace20696 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0454:f3a4b2dfcbdd44b39c90d9f6 | failed | Validation "Dogfood auto-resolution probe" failed; command: node -e process.exit(2); exitCode: 2; signal: null; durationMs: 39; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0454:385fa69b38dc4641839a69bb |
| ev:T-0454:e0c6c2bdd8184cd4a13d245e | blocked | Validation "Done-level harness validation" blocked; blocked because validation command execution error: spawnSync node EPERM; command: node dist/cli/main.js harness validate --task T-0454 --level done --json; exitCode: 0; signal: null; durationMs: 3917; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0454:fe8b5a505bd94cbaa6805dc4 |
| ev:T-0454:f48ea70b5ca34161897c7b79 | blocked | Validation "Done-level harness validation" blocked; blocked because validation command execution error: spawnSync bash EPERM; command: bash -lc node dist/cli/main.js harness validate --task T-0454 --level done --json; exitCode: 0; signal: null; durationMs: 4306; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0454:fe8b5a505bd94cbaa6805dc4 |
<!-- /hadara:slot -->
