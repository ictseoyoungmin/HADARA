# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0753:6a45b1b3abf940c9a1d6dbae | passed | validation | Validation "Helper and provenance tests" passed; failureClass: none; command: bash -lc npm run build && npm run typecheck:tools && npx vitest run --config vitest.dev.config.ts tests/unit/manual-publish-script.test.ts tests/unit/package-smoke-dry-run.test.ts tests/unit/release-dry-run.test.ts tests/unit/task-workflow-docs.test.ts; argvHash: sha256:edab9bc321a15519c3cc1c0816f3346729eaa7c81b7835b2e0b0389689b299cb; exitCode: 0; signal: null; durationMs: 13945; stdoutHash: sha256:8b8c0c75177f4d850cfd1b7c3a5c1d8ee35fb9ee02904078b6958d8c85883432; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0753:1d126ad6f5ef4a98a51075da | passed | validation | Validation "Publish helper dispatch and RC metadata contract" passed; failureClass: none; command: bash -lc bash -n scripts/release/manual-publish-rc.sh scripts/release/prepare-publish-env.sh && test "$(rg -c "run_hadara_cli evidence add-command" scripts/release/manual-publish-rc.sh)" = "2" && ! rg -n "run_dev_surface evidence add-command/run_hadara evidence add-command" scripts/release/manual-publish-rc.sh && rg -n "GH_PRERELEASE_ARGS=\(--prerelease\)/--draft=false --prerelease" scripts/release/manual-publish-rc.sh; argvHash: sha256:0b9a3c59d0794d0fe0c29902ac87dc8ecc30378f9700b5da27c8451adaad4117; exitCode: 0; signal: null; durationMs: 34; stdoutHash: sha256:67f4ce38298687d6980e639691c00f7e1a99e63e10d456a3aa3a30ac55793493; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0753:a22a52bbd16b4b5b87679851 | passed | validation | Validation "RC2 publication observation" passed; failureClass: none; command: bash -lc test "$(npm view hadara@0.5.0-rc.2 version)" = "0.5.0-rc.2" && test "$(npm view hadara dist-tags.next)" = "0.5.0-rc.2" && gh release view v0.5.0-rc.2 --repo ictseoyoungmin/HADARA --json isDraft,isPrerelease,tagName --jq ".isDraft == false and .isPrerelease == true and .tagName == \"v0.5.0-rc.2\""; argvHash: sha256:a2992c0383af8820f6b2ccabf8c18e30bb1215059341b3cc6b4ee315e4319b25; exitCode: 0; signal: null; durationMs: 1662; stdoutHash: sha256:a17fcf0a2f50e2d495e4f90ce263410edc183add6c62699a2facbccf60410f74; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0753:cc0f448e3b124451adad7d32 | passed | validation | Task closePlan done-level readiness for T-0753 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:eef61b6fd24cbd16401b21652f1f10d97709d2f7092b374c77d14170b6679768 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0753:56d9eb53fe874983b33f84bb |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
