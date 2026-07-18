# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0647:e4829fc7f41346409c716ea0 | passed | validation | Validation "npm test -- tests/unit/context-routing-e2e-smoke-script.test.ts tests/unit/session-start.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/package-recycle.test.ts" passed; command: npm test -- tests/unit/context-routing-e2e-smoke-script.test.ts tests/unit/session-start.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/package-recycle.test.ts; exitCode: 0; signal: null; durationMs: 12529; stdoutHash: sha256:2b951337c6c9cd9738bd7785c91ff086341e175138bbc2176719ccfb178f7419; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0647:3d00d5c078404df189771aaa | passed | validation | Validation "npm run build" passed; command: npm run build; exitCode: 0; signal: null; durationMs: 38246; stdoutHash: sha256:97fb9031ff5062da23b87bd8e925bfd317f8ec10b714b991205b95de53b5fa8a; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0647:7d5adbb50e4c4539a5677fc6 | passed | validation | Validation "node scripts/context-routing-e2e-smoke.mjs --project . --cli dist/cli/main.js --task T-0647 --timeout-ms 20000" passed; command: node scripts/context-routing-e2e-smoke.mjs --project . --cli dist/cli/main.js --task T-0647 --timeout-ms 20000; exitCode: 0; signal: null; durationMs: 12228; stdoutHash: sha256:2cc7be84ce43ded3855c7c68403a0b59b266e90d65c8768976dd08f3fa8fd02c; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0647:18e10b0efc3e4dfe94a9c6d8 | passed | validation | Cross-profile dogfood passed with current built CLI: basic, standard, and governed disposable projects initialized, status --json returned hadara.project.status.v2 select-work, task create produced T-0001, selected task status returned hadara.task.status.v2 author-task, finalize dry-run returned safe deferred-check plans, optional cache corruption preserved status health, and malformed canonical current-state returned degraded/blocked diagnostics. |
| ev:T-0647:29b432a85cd54bffa70c3b5b | passed | validation | Task finalize done-level readiness for T-0647 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:34068337861864771a59c2893abf669dea360d2a5aaa29f1e7d04d5782f628cf |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0647:841981d02191498b89af7f53 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
