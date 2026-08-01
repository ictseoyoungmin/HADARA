# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0742:49562a5f434b43b19232359b | passed | validation | npm run check passed after removing retired global state and MCP read surfaces |
| ev:T-0742:e86e4d3860054b53aaf6092f | passed | validation | docs registry JSON parsed successfully after retired-state registry cleanup |
| ev:T-0742:e13881b4c13c4161a7a73964 | passed | validation | git diff --check passed for retired-state cleanup changes |
| ev:T-0742:8b3665e282ac474ba36f5d9c | passed | validation | npm run check passed after repo-local smoke routing residue cleanup; public suite 128 passed/1 skipped and hadara-dev suite 16 passed |
| ev:T-0742:dac14efe7f2d4f3cb8fa15ad | passed | validation | Repo-local package smoke dry-run passed via node --import tsx tools/dev-surfaces.ts smoke package --dry-run --json; core feature smoke passed via tools/dev-surfaces.ts smoke run --profile core --json |
| ev:T-0742:e523944f299d45d2a9ec3f89 | passed | validation | T-0742 draft-level harness validation and git diff --check passed after handoff semantic cleanup |
| ev:T-0742:c2eead5b03a84763be90667b | passed | validation | Full npm run check passed after removing retired-state test fixtures and development-surface residue |
| ev:T-0742:2ba7478bfc4a40c884fdbeca | passed | validation | Draft harness validation passed after retired-state fixture and routing cleanup |
| ev:T-0742:12c1e581810d462a948a6fc6 | recorded | note | Previous close dry-run blocker record is superseded: AC-2 is now met; current close blockers are AC-5 and final Done history. |
| ev:T-0742:8c99e66968c74cb7b2e03b0e | passed | validation | Task-close unit suite passed after removing obsolete global-state fixture helper calls |
| ev:T-0742:a15c69b19321422796f1661e | passed | release | Clean-checkout smoke passed with reduced public evidence. |
| ev:T-0742:5be767e38405466092c27563 | passed | release | Host clean-checkout smoke passed after removing stale handoff/readiness fixture contracts; npm ci, build, npm run check, built CLI doctor/status, and strict release gate passed. |
| ev:T-0742:afe566423d11421ab318b4a5 | passed | validation | Task closePlan done-level readiness for T-0742 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:f6eec796e3bf850398a597d30e65df232be470d03a2896eede30f374acaff90a |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0742:f410ff1c48104a3f8cc62d45 |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0742:b8217fe938994c6191597997 | blocked | Repo-local clean-checkout smoke reached npm ci but was blocked in this sandbox by esbuild postinstall spawnSync EPERM; escalated rerun was unavailable due usage-limit rejection | Resolved | ev:T-0742:5be767e38405466092c27563 |
| ev:T-0742:d21c637c6a7642049b0fbf2d | blocked | task close --dry-run is blocked only on unfinished AC-2/AC-5 and final Done history; HANDOFF continuation semantic conflict is resolved | Resolved | ev:T-0742:12c1e581810d462a948a6fc6 |
| ev:T-0742:dd595efc202b4c5eabc3ee2a | blocked | Close dry-run is blocked because AC-5 clean-checkout smoke remains environment-blocked and TASK.md History is not Done; no stale evidence semantic issue remains. | Unresolved | evidence.jsonl |
| ev:T-0742:f63dc668f1f3409bbe48820a | failed | Clean-checkout smoke failed with reduced public evidence. | Resolved | ev:T-0742:5be767e38405466092c27563 |
| ev:T-0742:665e0913c8ad44c3a2223c53 | failed | Clean-checkout smoke failed with reduced public evidence. | Resolved | ev:T-0742:5be767e38405466092c27563 |
<!-- /hadara:slot -->
