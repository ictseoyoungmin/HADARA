# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0760:4c7302fc2dbe41348c3ce504 | passed | validation | Validation "Focused Init v1 authority tests" passed; command: npm run test:focused -- tests/unit/init-v1-model.test.ts tests/unit/docs-registry.test.ts tests/unit/docs-doctor.test.ts tests/unit/init.test.ts tests/unit/init-v1-upgrade.test.ts; exitCode: 0; signal: null; durationMs: 6339; stdoutHash: sha256:4f257b4aaef89e76aa0fd1a4e576841d8c44903e320d12f179ebc9a94240dae5; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0760:7a080cf46cfc43439a74a76b | passed | validation | Validation "Full repository validation" passed; command: npm run check; exitCode: 0; signal: null; durationMs: 34442; stdoutHash: sha256:069eb6ea6d939ca880d9a2310e2419a0aa1c75333a310247dd0698a64d14d42a; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0760:1bc1bbf1c21c423eb72bf470 | passed | validation | Validation "Built CLI build" passed; command: npm run build; exitCode: 0; signal: null; durationMs: 5966; stdoutHash: sha256:e3f09930a1a06f16f1130bb409f466330616a89831bf2d2ac62384a872b8545e; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0760:3ca3624e6c1e477b877824a2 | passed | validation | Validation "Built CLI authority and doctor smoke" passed; command: node dist/cli/main.js docs list --json; exitCode: 0; signal: null; durationMs: 181; stdoutHash: sha256:aa9332c8a7813ca26e67487a1d17684106ff7ac0cc45857b13dd3dfdab5ea701; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0760:85ce8d6fbf6f4831b9d3eba6 | passed | validation | Validation "Built CLI Init v1 fixture smoke" passed; command: bash -lc tmp=$(mktemp -d); trap 'rm -r -- "$tmp"' EXIT; cd "$tmp"; plan=$(node /home/ymin/HADARA-dev/dist/cli/main.js init --preset standard --json); hash=$(node -e 'process.stdout.write(JSON.parse(process.argv[1]).planHash)' "$plan"); node /home/ymin/HADARA-dev/dist/cli/main.js init --preset standard --execute --plan-hash "$hash" --json; node /home/ymin/HADARA-dev/dist/cli/main.js init doctor --json; node /home/ymin/HADARA-dev/dist/cli/main.js docs list --json; exitCode: 0; signal: null; durationMs: 391; stdoutHash: sha256:df0a1a924f2854a903f03acbde81de026c57ea4e5362137a5b2b62d8b4fdec96; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0760:5c3dda87ad6248c583bca0fd | passed | validation | Validation "Built CLI init doctor smoke" passed from direct result; Clean Init v1 fixture init doctor and docs list passed; resolves repo-root legacy scaffold baseline failure.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0760:e92671be028b471e97e3bd75 | passed | validation | Task finalize done-level readiness for T-0760 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:d86824613e39c8e78f9684a0675660b26cf95192d36fe39ddfe3b4c511043002 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0760:e33b210a5dca4dde97b46440 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0760:e5cae32256f8430a958c047b | failed | Validation "Built CLI init doctor smoke" failed; command: node dist/cli/main.js init doctor --json; exitCode: 6; signal: null; durationMs: 94; stdoutHash: sha256:68ae61442501261c014e8227732cc0465ef842cf273dd9bc1a6c61f288919350; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0760:5c3dda87ad6248c583bca0fd |
<!-- /hadara:slot -->
