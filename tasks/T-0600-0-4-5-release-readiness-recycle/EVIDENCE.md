# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0600:6cec0ec72e024cdaaca3abaf | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0600:91d4e74557ff4b69b7148f37 | passed | validation | Validation "TypeScript build" passed from direct result; npm run build passed after package-smoke spawn-result fallback hardening.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0600:e54a559333a9420fb59138f7 | passed | validation | Validation "Docker build" passed from direct result; timeout 120 docker exec hadara-dev bash -lc 'cd /workspace && npm run build' passed after package-smoke hardening.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0600:3323520f01584e5695dcf521 | passed | validation | Validation "Docs and init doctor" passed from direct result; docs doctor --scope all returned ok=true and clean; init doctor returned ok=true with HADARA-dev-specific warnings only.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0600:f50d17a72417459a85bf697b | passed | validation | Validation "Package smoke regression tests" passed from direct result; npx vitest run tests/unit/package-smoke-dry-run.test.ts passed with 22 tests, including empty stdout fallback coverage.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0600:16464638954d4ed0b7e80a06 | passed | validation | Validation "Package smoke" passed from direct result; smoke package --execute --task T-0600 --attach-evidence --json passed; package-smoke summary artifact attached at tasks/T-0600-0-4-5-release-readiness-recycle/artifacts/package-smoke/2026-07-13T14-57-55.659Z-summary.json.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0600:5ce736f726224041853a063e | passed | validation | Validation "Release gate" passed from direct result; release gate --mode strict --json passed and recognized latest package-smoke evidence from T-0600.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0600:76d390dc31cb49d097da4169 | passed | validation | Validation "Installed-candidate adoption dogfood recycle" passed from direct result; Fresh current-source tarball installed into /tmp/hadara-t0600-prefix-ikrm9O; TypeScript service, Python/data, and governed web monorepo fixtures passed brownfield init dry-run, explicit adopt execute, docs doctor, baseline task validation/finalize closed-valid, and re-run init returned hadara-current:0 writes for all three.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0600:7b5bf88557c24429ace2d3ac | passed | validation | Task finalize done-level readiness for T-0600 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:5c75f7ba69070ad0328b3c1af68fe066844ed7bade7c6245d709b93a201e0feb |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0600:409df289cb634cc2954d86d6 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
