# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0450:0762fb7c51c7498782dcbc9a | passed | validation | Validation "Focused unit tests" passed; command: bash -lc cd /tmp/hadara && npx vitest run tests/unit/validation-run.test.ts tests/unit/task-finalize.test.ts tests/unit/command-registry.test.ts tests/unit/help.test.ts; exitCode: 0; signal: null; durationMs: 2290; stdoutHash: sha256:2cfc0686f9c728c0ac74c0a09b9d8de67dbef34d9eb92e498c7e69e2875e5cce; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0450:0fb9d2b9c8574b1595a7c89f | passed | validation | Validation "TypeScript build" passed; command: bash -lc cd /tmp/hadara && npm run build; exitCode: 0; signal: null; durationMs: 5330; stdoutHash: sha256:692cfda59649251706a4488585066790f572450b0eb37df66f9dcd284492dfb1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0450:41e99cf3985746bc9e75106e | passed | validation | Validation "Built CLI smoke" passed; command: node dist/cli/main.js help --json; exitCode: 0; signal: null; durationMs: 255; stdoutHash: sha256:811130840b68d3c3887df5012b3eadde22e6ebfa8b3f9a5f48388596f9c5e20d; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0450:e1432ab6b23e42ab9a6c02a2 | passed | validation | Validation "Capsule check failure resolution" passed; command: git -c safe.directory=/workspace diff --check; exitCode: 0; signal: null; durationMs: 3871; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0450:52e434e359144e9387c5c591 | passed | validation | Validation "Capsule checks" passed; command: bash -lc node dist/cli/main.js harness validate --task T-0450 --level done --json && node dist/cli/main.js evidence lint --task T-0450 --json && git -c safe.directory=/workspace diff --check; exitCode: 0; signal: null; durationMs: 9041; stdoutHash: sha256:9fbcae0f69811875e20d64f53d719286f4b6dfd9e5cb08632e677013f683bf20; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0450:d7a97a8317c3479dae616a5b | passed | validation | Validation "Focused unit tests" passed; command: bash -lc cd /tmp/hadara && npx vitest run tests/unit/validation-run.test.ts tests/unit/task-finalize.test.ts tests/unit/command-registry.test.ts tests/unit/help.test.ts; exitCode: 0; signal: null; durationMs: 3167; stdoutHash: sha256:6f7989842e6d982a8cbface1495ff74bd3f68c0572f5b1d858cbbfcf917127c3; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0450:ea07a22c3f7e4630a2987e12 | passed | validation | Validation "TypeScript build" passed; command: bash -lc cd /tmp/hadara && npm run build; exitCode: 0; signal: null; durationMs: 5651; stdoutHash: sha256:692cfda59649251706a4488585066790f572450b0eb37df66f9dcd284492dfb1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0450:91632ae5de42456aa4e2c608 | passed | validation | Validation "Focused unit tests" passed; command: bash -lc cd /tmp/hadara && npx vitest run tests/unit/validation-run.test.ts tests/unit/task-finalize.test.ts tests/unit/command-registry.test.ts tests/unit/help.test.ts tests/unit/evidence-projection.test.ts; exitCode: 0; signal: null; durationMs: 3264; stdoutHash: sha256:123031527dbdd6bf81466cdd9c439c021e3148a951069d5500e18262a1cf8958; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0450:727253fe58994cdbab7cb712 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0450:e348b622b435402a91bc2561 | failed | Validation "Capsule checks" failed; command: bash -lc node dist/cli/main.js harness validate --task T-0450 --level done --json && node dist/cli/main.js evidence lint --task T-0450 --json && git diff --check; exitCode: 6; signal: null; durationMs: 3876; stdoutHash: sha256:827fae0ba853c407f0a856e88b6740a0683a6ca43e80f0d0f1d3d9bfd70e6927; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0450:e1432ab6b23e42ab9a6c02a2 |
| ev:T-0450:d0a6ff188d7b4db2a9446736 | failed | Validation "Capsule check failure resolution" failed; command: git diff --check; exitCode: 129; signal: null; durationMs: 14; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:16fe521de56b762a2ed6bb75c04179b3ceb2f2fe6df0dff877f8df07e5851474 | Resolved | ev:T-0450:e1432ab6b23e42ab9a6c02a2 |
<!-- /hadara:slot -->
