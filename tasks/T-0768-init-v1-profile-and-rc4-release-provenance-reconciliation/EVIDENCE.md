# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0768:ab000bf620c8436b95d71943 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0768:574618e1931c47718869c2ce | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0768:98a8b28018e84a4680711ca0 | passed | release | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. |
| ev:T-0768:8abab58b4dcb463daec8ed66 | passed | release | Package smoke local passed with reduced public evidence. |
| ev:T-0768:6d2718b51d524da89e12071e | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0768:659f0c0f62ee4de7a8bb3178 | passed | validation | Full repository validation: npm run check passed (128 files, 1040 tests; HADARA dev suite 16 files, 137 tests). |
| ev:T-0768:db1fe002131541458f3d94c3 | passed | release | Strict release gate: node --import tsx tools/dev-surfaces.ts release gate --mode strict --json passed with no issues. |
| ev:T-0768:1daa355fde3446e2b6d101bb | passed | validation | Focused protocol/profile regression: vitest protocol-consistency, init-v1-model, and task-workflow-docs passed (3 files, 38 tests). |
| ev:T-0768:ed2127707cb74a6288ac3105 | passed | release | Release dry-run and publish dry-run: RC4 readiness ready with zero blockers; publish dry-run reported only missing-token warnings and executed no mutation. |
| ev:T-0768:1cc0f4334d424a6ebabada49 | passed | validation | Evidence lint: 9 records and 9 projected Markdown rows passed with zero errors or warnings. |
| ev:T-0768:154175e68ba44b0b9278d86c | passed | validation | Task closePlan done-level readiness for T-0768 passed before close evidence append; taskValidationOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:7be11ccb648ed76f0db8b2d74640b5eeacd80973722a3df21d5f7d30d62f8d7e |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0768:b15bff48b5564b5690cd5bad |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
<!-- /hadara:slot -->
