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
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0565:a9d1124b34c44caba88526f2 | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Unresolved | evidence.jsonl |
| ev:T-0565:f965b00a64694e9ba2fb0415 | failed | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. | Unresolved | evidence.jsonl |
| ev:T-0565:d3b010fccb8c4dc4a723131b | failed | Clean-checkout smoke failed with reduced public evidence. | Unresolved | evidence.jsonl |
<!-- /hadara:slot -->
