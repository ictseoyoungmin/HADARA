# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0451:c977116a0d344e49b78c69a7 | passed | validation | Validation "Focused unit tests" passed; command: bash -lc cd /tmp/hadara && npx vitest run tests/unit/init.test.ts tests/unit/help.test.ts tests/unit/lifecycle-guide.test.ts tests/unit/command-registry.test.ts; exitCode: 0; signal: null; durationMs: 2814; stdoutHash: sha256:45d3c9ee4cee9db0ef0ebdab48d6db5338be7158b7746a84eec93759e4ac4056; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0451:4c3c982e9f2d405489410abe | passed | validation | Validation "TypeScript build" passed; command: bash -lc cd /tmp/hadara && npm run build; exitCode: 0; signal: null; durationMs: 5994; stdoutHash: sha256:692cfda59649251706a4488585066790f572450b0eb37df66f9dcd284492dfb1; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0451:dcb6cf8a7bc6407b8a7ec368 | passed | validation | Validation "Capsule token repair" passed; command: bash -lc ! rg -n "\/ .* \/ .* \/ done \/" tasks/T-0451-t-04a23-validation-run-workflow-polish/TASK.md && ! rg -n "\/ AC-[0-9]+ .* \/ Yes \/ Done \/" tasks/T-0451-t-04a23-validation-run-workflow-polish/TASK.md; exitCode: 0; signal: null; durationMs: 155; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:49dbe77f52bb3748954d092e9996eeca9a4377c0b3e60328f9647937ad723e07 |
| ev:T-0451:9a87b48cef7e481e8bb3faf1 | passed | validation | Validation "Capsule checks" passed; command: bash -lc node dist/cli/main.js harness validate --task T-0451 --level done --json && node dist/cli/main.js evidence lint --task T-0451 --json && git -c safe.directory=/workspace diff --check; exitCode: 0; signal: null; durationMs: 9110; stdoutHash: sha256:1218979d1db71c2a4fb962a811e6864ee51931658de55fe587dd666227061387; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0451:9173014c0422453a8e8554fe | passed | validation | Validation "Capsule checks" passed; command: bash -lc node dist/cli/main.js harness validate --task T-0451 --level done --json && node dist/cli/main.js evidence lint --task T-0451 --json && git -c safe.directory=/workspace diff --check; exitCode: 0; signal: null; durationMs: 8517; stdoutHash: sha256:61bdbed18c764344810fd7fc10c51bda5facfbb9d8269068c4bb1520996466fb; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0451:1624282c18f040179d54f115 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0451:51061db198d24ec58b09235c | failed | Validation "Capsule checks" failed; command: bash -lc node dist/cli/main.js harness validate --task T-0451 --level done --json && node dist/cli/main.js evidence lint --task T-0451 --json && git -c safe.directory=/workspace diff --check; exitCode: 6; signal: null; durationMs: 9668; stdoutHash: sha256:91c58ed23264b0bf79d2324b8e7d70b36bafe635b5d0831daac76a0c8f3b603d; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0451:dcb6cf8a7bc6407b8a7ec368 |
| ev:T-0451:0472ad4b2b8d4727a4151a70 | failed | Validation "Capsule checks" failed; command: bash -lc node dist/cli/main.js harness validate --task T-0451 --level done --json && node dist/cli/main.js evidence lint --task T-0451 --json && git -c safe.directory=/workspace diff --check; exitCode: 6; signal: null; durationMs: 3364; stdoutHash: sha256:9699b166001e83ab410c713e04f60d5ecad82b864cd62636084a1c51d9e4fc5c; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0451:dcb6cf8a7bc6407b8a7ec368 |
<!-- /hadara:slot -->
