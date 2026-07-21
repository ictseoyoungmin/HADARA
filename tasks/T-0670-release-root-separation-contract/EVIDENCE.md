# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0670:455c6f9b9c8a4ca986844853 | passed | validation | Focused package root-role regression tests passed after contract/schema/docs updates: package-smoke dry-run, package-recycle, and schema-runtime suites passed 3 files / 51 tests. |
| ev:T-0670:fb096f77aeb147cba489741a | passed | validation | Approved external npm run check passed after sandbox EPERM rerun: TypeScript build succeeded and Vitest passed 166 files / 1226 tests. |
| ev:T-0670:9912888711ee486e8844c6c0 | passed | validation | Docker sync-build passed: container build refreshed workspace dist and built CLI version smoke reported hadara packageVersion 0.5.0-rc.1 with distLooksStale=false. |
| ev:T-0670:a0db4de46a804dacac1d6aab | passed | validation | Built CLI root-role dry-runs passed: smoke package and package recycle emitted sourceRoot/evidenceRoot/smokeProjectRoot for explicit roots and reported no issues. |
| ev:T-0670:e2ca46f628b54ac588f271ab | passed | validation | Docs doctor passed with scope all after release root separation contract docs updates: health=healthy, currentnessVerdict=clean, semanticDriftIssues=0. |
| ev:T-0670:4040e2df2d3f4ad999d17a47 | passed | validation | Task finalize done-level readiness for T-0670 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:81b7e2ac61d2d378ea13651356933d5c82514a6eb54044fa42047353ab393ec2 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0670:529a28c9c4b2410bb6c44dc4 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0670:ba48de94868e4c1ab332b896 | blocked | Sandboxed npm run check failed in status-adapters.test.ts because test-local git init returned spawnSync git EPERM; classified as sandbox execution friction before approved rerun. | Resolved | ev:T-0670:455c6f9b9c8a4ca986844853 |
<!-- /hadara:slot -->
