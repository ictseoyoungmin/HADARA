# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0502:364d76991dbb423e88b1d1d6 | recorded | decision | Recorded secondary T-0501 reviewer findings RV-1 through RV-11 in DOGFOOD_REPORT.md and expanded T-0502 TASK.md plan/acceptance to handle them before 0.4.1-rc.0 release smoke. |
| ev:T-0502:13a900a8a63d410f8cdf13a1 | passed | validation | Focused Docker unit tests passed: 13 files / 110 tests covering init docs, help routing, validation run exit semantics, session/context command guidance, task selection, task create scaffold, state projection, workflow docs, and package smoke generated-init-docs drift gate. |
| ev:T-0502:afb73b2121f0488983e51414 | passed | validation | Docker TypeScript build passed with npm run build after T-0502 CLI and package smoke changes. |
| ev:T-0502:bdd98fcb1aa449038e9c5380 | passed | validation | Built CLI smokes passed: representative --help commands exited 0, fresh standard init generated current workflow docs with finalize --auto and slice state guidance, session-start emitted hadara command forms without node dist/task ready leakage, validation run returned wrapper exit 6 with Failed/non-zero-exit for child exit 3, state verify exposed ok/consistent semantics, and package smoke --execute passed including generated-init-docs. |
| ev:T-0502:8cd65df224074988877dd410 | passed | validation | Fresh temporary governed project smoke passed: init, doctor, task create/status detail, session start, schema, slice add with not-started status, and slice render returned ok true. |
| ev:T-0502:9bd95384fc20448a8a0d2525 | passed | validation | Package smoke --execute passed with timeout 300 after final build; npm pack, isolated install, doctor, command-surface-drift, generated-init-docs, feature-smoke-core, and cleanup all passed. generated-init-docs passed and confirmed generated workflow docs expose finalize --auto and slice guidance without stale removed-command instructions. |
| ev:T-0502:1be0ba3bbdbe47d4a3940f1e | passed | validation | Resolved the failed Harness validate T-0502 attempt after confirming the blocker was the just-recorded unresolved failed evidence; rerun will validate the task after this resolution marker. |
| ev:T-0502:090d97e939bd4a299098c58b | passed | validation | Validation "Harness validate T-0502" passed; command: node dist/cli/main.js harness validate --task T-0502 --level done --json; exitCode: 0; signal: null; durationMs: 659; stdoutHash: sha256:0c3d41a55a0067de9f49e13613d4a5cac32ecf99bee9d972685f7c5f71a2aa07; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0502:c4b2d1d424fd4b4faf4ff7a6 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0502:4f183a614d654a64b8f4ffae | failed | Validation "Harness validate T-0502" failed; command: node dist/cli/main.js harness validate --task T-0502 --level done --json; exitCode: 6; signal: null; durationMs: 958; stdoutHash: sha256:302b1ff308dc41ff37aacc71eb9df4bbd78fcaa0533dacf2cd0245dc801ca758; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0502:1be0ba3bbdbe47d4a3940f1e |
<!-- /hadara:slot -->
