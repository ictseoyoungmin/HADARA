# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0453:facedecf71cf4747adfdd522 | passed | validation | Validation "Focused validation-run tests" passed; command: bash -lc cd /tmp/hadara && npx vitest run tests/unit/validation-run.test.ts tests/unit/init.test.ts tests/unit/lifecycle-guide.test.ts; exitCode: 0; signal: null; durationMs: 1976; stdoutHash: sha256:434b0f2792be003be2e00abd6f2f1c1af4fc4a335c0d15fae1b3a869a28ee784; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0453:bff69d665fcb466fb9bc910b | passed | validation | Validation "TypeScript build" passed; command: bash -lc cd /tmp/hadara && npm run build; exitCode: 0; signal: null; durationMs: 5583; stdoutHash: sha256:692cfda59649251706a4488585066790f572450b0eb37df66f9dcd284492dfb1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0453:6a76b8b335fb4151b6d9f92a | passed | validation | Validation "Final capsule checks" passed; command: bash -lc node dist/cli/main.js harness validate --task T-0453 --level done --json && node dist/cli/main.js evidence lint --task T-0453 --json && git -c safe.directory=/workspace diff --check; exitCode: 0; signal: null; durationMs: 8149; stdoutHash: sha256:03e922a9a9b9b6f61f1b371062a7a46b0806620d00748d99d4b7fbf759a9d91a; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0453:cf54bb242b954cca89515c21 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
