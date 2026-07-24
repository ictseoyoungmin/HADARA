# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0701:ca6ee4dfdcf3407eaa80bb1c | passed | validation | Init v1 rollback focused tests (incl. new external-modification regression): tests/unit/init-v1-transaction.test.ts 10/10 passed; tests/unit/init.test.ts 35/35 passed. |
| ev:T-0701:fb960b46738548c897baf37b | passed | validation | HADARA-dev suite (vitest.dev.config.ts) run directly after restoring this capsule's edits into the same Docker ext4 copy since npm run check's public/hadara-dev chain short-circuited on the unrelated public failure: 16/16 files, 127/127 tests passed. |
| ev:T-0701:be4c05c13019422799456824 | passed | validation | Docker dist refresh (dev:docker-sync-build): npm ci, tsc build, dist synced to workspace, built CLI version smoke passed; dist is current for this capsule's changes. |
| ev:T-0701:ba6f68fc102647499a0a858b | passed | validation | Task finalize done-level readiness for T-0701 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:03739640288a44c06a7255bbd8f16d130ca1765053052ccaedb8374a36daa62a |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0701:9cceb4b958cb4760857c47a8 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0701:f06d07e22d0746be92fffc26 | failed | Clean Docker ext4 npm run check: build and typecheck:tools passed; public suite 139/140 files, 1089/1090 tests passed. The 1 failure (tests/unit/status-current-state-source.test.ts self-reproduction case) is pre-existing and unrelated: verified reproducible on unmodified git HEAD sources, caused by dev-docker-sync-build.sh copy_full_workspace excluding the whole .hadara directory (including tracked .hadara/state/current.json) from the check-only tar copy, not by this capsule's changes. | Unresolved | evidence.jsonl |
<!-- /hadara:slot -->
