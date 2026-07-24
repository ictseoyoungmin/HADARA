# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0697:c030f5ce7ba44b289afb3e6c | passed | validation | Validation "npm install --package-lock-only" passed from direct result; npm install --package-lock-only completed on the workspace and regenerated package-lock root devDependencies to match package.json.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0697:b6287de625eb4ec790628adb | passed | validation | Validation "npm ci" passed from direct result; Docker ext4 clean copy ran npm ci successfully: added 54 packages, audited 55 packages; host mounted npm ci was blocked by symlink EPERM.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0697:e0fed34bf4fd42828d2479ec | passed | validation | Validation "npm run check" passed from direct result; Docker ext4 clean copy with .hadara included ran npm run check successfully: build, tools typecheck, public tests 137 files/1069 tests, HADARA-dev tests 16 files/127 tests.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0697:2602690f00cc4f5d95e2b7d7 | passed | validation | Validation "node dist/cli/main.js version" passed from direct result; Built CLI version smoke reported packageVersion 0.5.0-rc.1, git head 67dcf93a3ed9d2c27dd97abb61ef2b9d6a77bcf3, distLooksStale false.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0697:eae22eb9eeaf4e459da4335a | passed | validation | Validation "focused regression test" passed from direct result; Focused regression coverage passed inside npm run check: manual-publish-script, command-registry, context-graph-cli, context-routing scripts, package-recycle, and session-start tests covered build freshness and context.pack removal.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0697:85ddc799f71f403da14b6930 | passed | validation | Validation "git diff --check" passed from direct result; git diff --check passed with no whitespace errors.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0697:8ada5a6be1194d248457a486 | passed | validation | Validation "package-lock Dashboard dependency scan" passed from direct result; package-lock root devDependencies match package.json (@types/node, tsx, typescript, vitest only); scans found no preact direct dependency and no removed Dashboard direct dependency entries.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0697:eb23fa89dbc44cb5a74c6cef | passed | validation | Validation "context pack public surface removal" passed from direct result; Built CLI rejects 'context pack --json'; command registry JSON has no context.pack entry while retaining context.graph and context.slice; public docs now describe context pack as removed/internal-only.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0697:2323f6ca4be44113b4735230 | passed | validation | Task finalize done-level readiness for T-0697 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:992187799c6975a7505a3bce4e09f30d9c9c971738029fa0fbe738f9026ac30c |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0697:a1e3eeac2f16485c97f42165 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
