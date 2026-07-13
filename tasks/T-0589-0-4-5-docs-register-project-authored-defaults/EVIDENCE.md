# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0589:03ad7e26d0c347388b638d8e | passed | validation | Validation "docs register project-authored defaults" passed from direct result; Focused docs-registry and schema fixture tests passed; Docker sync build passed 153 files / 1074 tests; built CLI smoke confirmed docs register writes owner=project, origin.type=project-authored, editPolicy=agent-editable-with-review while scaffold seed docs remain owner=hadara-docs/generatedBy=hadara init; docs doctor --scope all was clean.; command: direct-result; exitCode: 0; signal: null; durationMs: 0; stdoutHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0589:e27aec75def946be9e7cfc3b | passed | validation | Task finalize done-level readiness for T-0589 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:157300b7865ac10a14a537201e0070d21f4ed2f7e228cdde06333ab8fd685f63 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0589:4ed4113d2c924ca8bee0465c |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
