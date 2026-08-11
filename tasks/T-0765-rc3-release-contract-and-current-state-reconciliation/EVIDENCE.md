# EVIDENCE

This file is a human-readable projection from `evidence.jsonl`.

Do not hand-edit this file.

## Validation Evidence

<!-- hadara:slot evidence.validation-summary -->
| Evidence ID | Outcome | Category | Summary |
|---|---|---|---|
| ev:T-0765:27a905b549d348c1803bc0b6 | passed | release | RC3 public state verified: npm hadara@next=0.5.0-rc.3, latest=0.4.6; GitHub v0.5.0-rc.3 isDraft=false isPrerelease=true with zero custom assets; T-0763 public consumer deep lifecycle evidence remains closed-valid. |
| ev:T-0765:78959c08ee5a43409c1d2ef7 | passed | release | Read-only npm recovery: hadara-0.5.0-rc.3.tgz is 427965 bytes and SHA-256 843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53, matching T-0763 expected; checksum reconstruction is 88 bytes/hash fe89b68ca6e773f36a21b3b166a06012a51dbbad634e1513a75eeb9e2aecd4a7; manifest reconstruction from npm pack file list and release metadata is 23426 bytes/hash eb52a65efc728be7ef1434670b7ab547b55f5c08f8252aae6cf037d07d35c903. Classified byte-identical reconstruction, not retained-original proof. |
| ev:T-0765:187224ea14f54698b5421bcf | passed | validation | Fresh standard preset reproduced on current built CLI and public hadara@0.5.0-rc.3: init doctor passed, docs doctor currentnessVerdict=clean, protocol doctor emitted the same eight warning-only scaffold/profile issues. Root cause is Init v1 compact scaffold versus protocol-consistency richer contract; stable disposition is separate rc.4 remediation before promotion. |
| ev:T-0765:ae072fdcaa1a4f7fb6b6b08a | passed | operation | Graphify guide portability check: docs/GRAPHIFY_FOR_HADARA_AGENTS.md uses command -v graphify and a /home/ymin/.local/bin/graphify fallback; no /home/ymin/.local/bin/graphify remains. |
| ev:T-0765:c51b84717b0f43308238c370 | passed | operation | Correction: the Graphify guide portability result is command -v graphify with a portable user-home fallback; no machine-specific absolute path remains in docs/GRAPHIFY_FOR_HADARA_AGENTS.md. Supersedes the shell-expanded summary only. |
| ev:T-0765:d40c4b95dfba4cb18f53c8aa | passed | validation | Regenerated docs/DOC_REGISTRY.md from the existing .hadara/docs-registry.json through reviewed dry-run and before-hash guarded execute so the registered Graphify guide is reflected in the tracked projection. |
| ev:T-0765:81536d4748da4e4ab22b2417 | passed | validation | Validation "Full repository check after registry projection refresh" passed; command: npm run check; exitCode: 0; signal: null; durationMs: 34079; stdoutHash: sha256:66310e31917e45e9bce11d5f922812993eb714737c2e9ffedb9505458e438ed9; stderrHash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| ev:T-0765:ad5149d0f06c4f408c6af94c | passed | validation | Resolution of the initial full-check failure: docs/DOC_REGISTRY.md was regenerated from the canonical registry with a reviewed before-hash execute, then npm run check passed. |
| ev:T-0765:6eb26395d958488cb81d7621 | passed | validation | Task finalize done-level readiness for T-0765 passed before close evidence append; harnessOk=true; evidenceLintOk=true; protocolDoctorOk=true; validationReportHash=sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash=sha256:37f396890c0a9674780088727a98c87c9fb3f6599dfa5052d116cce80ce65594 |
<!-- /hadara:slot -->

## Close Proof

<!-- hadara:slot evidence.close-proof -->
| Check | Result | Evidence |
|---|---|---|
| close evidence | passed | ev:T-0765:ad9536476c6c4780933c27ef |
<!-- /hadara:slot -->

## Failed / Blocked / Residual Evidence

<!-- hadara:slot evidence.residuals -->
| Evidence ID | Outcome | Summary | Disposition | Reference |
|---|---|---|---|---|
| ev:T-0765:858003cd88904ffa92c1298d | failed | Validation "Full repository check" failed; command: npm run check; exitCode: 1; signal: null; durationMs: 38670; stdoutHash: sha256:a204a294a2a2d92d6a2b88b3e239b7ed4e490afb53c15f09bb33d4ffdcd04981; stderrHash: sha256:fd82973f860da126996a21c9fb47b31a74aa369a58a0ed950ee49edfc8db5076 | Resolved | ev:T-0765:ad5149d0f06c4f408c6af94c |
<!-- /hadara:slot -->
