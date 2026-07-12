# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0576:95e147a95ff943b9bf3cdb7b | passed | validation | Focused runtime-version regression test passed: installed non-HADARA project no longer reports distLooksStale from node_modules bin mtime. |
| ev:T-0576:e47e8f11c2e04ab2a09bdece | passed | validation | Docker full suite passed during T-0576 after runtime-version fix: 153 files and 1064 tests passed; dist refreshed with npm run dev:docker-sync-build. |
| ev:T-0576:3d56c22eddb3403e952b6b13 | passed | validation | R2 standard-profile external dogfood passed: local package installed in /tmp, 8 Task Capsules finalized, direct validation fallback recorded for host EPERM, final status closed-valid and no stale nextWork. |
| ev:T-0576:bb1061b47d4a45d69472ffd6 | passed | validation | R2_DOGFOOD_REPORT.md written with capsule table, metrics, R1 rechecks, findings, good UX, and release decision: no new v0.4.4 blocker. |
| ev:T-0576:a82fbac07f2b45b3a39ff1d8 | passed | validation | Task finalize done-level readiness for T-0576 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:5e6ea8fdbd4f6c4c2957c01b3cd0aa79b552780d783b73195c1eeb4864e42dd3 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0576:6232326ea77d4bc19059ab7c |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
