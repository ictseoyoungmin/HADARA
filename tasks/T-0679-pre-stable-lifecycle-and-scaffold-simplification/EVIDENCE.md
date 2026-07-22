# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0679:5b4cbb05bead4af995c259d6 | passed | validation | Validation "Full source check" passed from direct result; Docker npm run check passed after fixes: TypeScript build plus 166/166 test files and 1239/1239 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0679:a82d6e47c7d24155b19feb50 | passed | validation | Validation "Focused status, close, schema, help, and capability tests" passed from direct result; Docker focused validation passed 9 files and 113 tests; follow-up schema/workflow/dashboard retry passed and schema runtime retry passed 2 files and 24 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0679:1063ecdea62a4393866a9a26 | passed | validation | Validation "TypeScript build" passed from direct result; Docker npm run build passed and refreshed /workspace/dist.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0679:5a830d31a309409aa0a1f600 | passed | validation | Validation "Built CLI status/task-status/close dry-run smokes" passed from direct result; Built task status and deprecated status alias both emitted task.status v2 for active T-0679 with command task.status; close dry-run is recorded separately before close.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0679:90795c1e19c84012a05ca0a7 | passed | validation | Validation "Built CLI status/task-status/close dry-run smokes" passed from direct result; Retry after TASK.md source-role repair: adaptive built CLI smokes and read-only close plan passed.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0679:46795b5294a24b58a5c086df | passed | validation | Task finalize done-level readiness for T-0679 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:c4d01d139544b812a5ff8727350480fb6c7defa6791dcb778bceedc0e597a142 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0679:6befe860780641549ca550c6 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0679:d311a2477e3b464083e712b1 | failed | Validation "Full source check" failed from direct result; Initial Docker npm run check: 163/166 files and 1236/1239 tests passed; adaptive-contract fixtures needed updates and dashboard bootstrap exceeded its 60s full-suite timeout.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0679:5b4cbb05bead4af995c259d6 |
| ev:T-0679:ac45a3db5a1f4290aca3fb3b | failed | Validation "Built CLI status/task-status/close dry-run smokes" failed from direct result; First built close dry-run exposed five invalid source-role tokens in TASK.md; no writes executed.; command: direct-result; exitCode: 1; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 | Resolved | ev:T-0679:90795c1e19c84012a05ca0a7 |
<!-- /hadara:slot -->
