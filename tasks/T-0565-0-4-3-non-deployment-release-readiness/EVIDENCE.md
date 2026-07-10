# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0565:910e72184029437fb97f5c7e | passed | validation | Validation "0.4.3 source metadata and full Docker" passed from direct result; Source package/lock/current release/onboarding/docs agree on 0.4.3; built CLI reports 0.4.3 with distLooksStale=false; Docker sync-build passed 153 files and 1052 tests; docs doctor currentness is clean.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0565:4b77511871754aea8fb6868a | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0565:e9c78040f1b2478eb6d695fd | passed | validation | Validation "Installed tarball measurement and consumer toy" passed from direct result; Local hadara-0.4.3.tgz installed in 1082ms; installed CLI reported 0.4.3; installation-to-first-capsule was 1334.44ms; standard profile closed-valid in six primary calls with currentness clean and zero recommendation corrections.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0565:65931991bcd440c3ace86d3a | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0565:674c57cb80c84c4c92887880 | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0565:b14bfda248e844179027f134 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0565:c6cfa0b13ff44604aec81d05 | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0565:974b9b78995a42bc9fee14c0 | passed | validation | Validation "Artifact/package/clean-checkout smoke" passed from direct result; Final source artifact hadara-0.4.3.tgz passed contents verification (264 files, sha256 c83d3e45...f0436); package smoke passed isolated install/doctor/command parity/init/core smoke; clean-checkout passed npm ci/build/check/doctor/status/strict gate with cleanup.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0565:f241c2bd2f384a98988f66d4 | passed | validation | Validation "Strict gate, release dry-run, and currentness audit" passed from direct result; Strict release gate passed every check; release dry-run is ready with zero blockers/warnings and all publish/GitHub/Docker actions willExecute=false; docs doctor reports currentness clean and semantic drift zero.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0565:1b7ab102bdd640a4b16a08e9 | passed | release | Final clean ext4 artifact and clean-checkout passes resolve the two mounted-workspace git-status timeouts and the stale Project State release-gate failure; final evidence ids are ev:T-0565:674c57cb80c84c4c92887880 and ev:T-0565:c6cfa0b13ff44604aec81d05. |
| ev:T-0565:f2c126c841db41d3af3406c9 | passed | validation | Task finalize done-level readiness for T-0565 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:04226a7a36a855fcfa9bbe631db0690818bd09e25a148d747572a91fc6ac0275 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0565:3c69a22a9bff466a93bcb03d |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0565:a9d1124b34c44caba88526f2 | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Resolved | ev:T-0565:1b7ab102bdd640a4b16a08e9 |
| ev:T-0565:f965b00a64694e9ba2fb0415 | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Resolved | ev:T-0565:1b7ab102bdd640a4b16a08e9 |
| ev:T-0565:d3b010fccb8c4dc4a723131b | failed | Clean-checkout smoke failed with reduced public evidence. | Resolved | ev:T-0565:1b7ab102bdd640a4b16a08e9 |
<!-- /hadara:slot -->
