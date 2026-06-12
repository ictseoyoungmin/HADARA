# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-11T14:47:07.222Z | command-log | Validated rc.1 helper rejects mismatched T-0297 release capsule before npm auth or publish work. | passed | public | evidence.jsonl |
| 2026-06-11T14:47:07.308Z | command-log | Ran npm run check in sandbox-external /tmp validation copy; build passed and Vitest reported 117 files / 749 tests passed. | passed | public | evidence.jsonl |
| 2026-06-11T14:47:08.188Z | command-log | Validated manual publish helper cleanup: allowed dry-run outputs were cleaned, helper advanced to npm auth, and temp repo git status stayed clean. | passed | public | evidence.jsonl |
| 2026-06-11T14:47:25.422Z | command-log | Ran bash -n scripts/release/manual-publish-rc.sh; shell syntax check passed. | passed | public | evidence.jsonl |
| 2026-06-11T14:56:20.708Z | command-log | Task close validation for T-0301 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:473c7650204de875a588bc9ba8be6ec84f2a5f0a1acaccdcefdf2e060e6c7638. | passed | public | evidence.jsonl |
| 2026-06-12T02:21:29.526Z | command-log | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. (artifacts/release-artifact/2026-06-12T02-21-29.526Z-report.json) | passed | public | artifacts/release-artifact/2026-06-12T02-21-29.526Z-report.json |
| 2026-06-12T02:21:31.665Z | command-log | Package smoke local passed with reduced public evidence. (artifacts/package-smoke/2026-06-12T02-21-31.665Z-summary.json) | passed | public | artifacts/package-smoke/2026-06-12T02-21-31.665Z-summary.json |
| 2026-06-12T02:21:55.206Z | command-log | Clean-checkout smoke passed with reduced public evidence. (artifacts/clean-checkout-smoke/2026-06-12T02-21-55.206Z-summary.json) | passed | public | artifacts/clean-checkout-smoke/2026-06-12T02-21-55.206Z-summary.json |
| 2026-06-12T02:22:48.132Z | command-log | Published hadara@0.3.0-rc.1 to npm and verified npm view returned 0.3.0-rc.1; GitHub Release draft requested: false. | passed | public | evidence.jsonl |
| 2026-06-12T02:38:58.176Z | command-log | Post-publish docs update validation: focused README/init regression passed in /tmp/hadara-publish with 1 file / 21 tests. | passed | public | evidence.jsonl |
| 2026-06-12T02:39:53.415Z | command-log | Task close validation for T-0301 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:339a61076b2d36dad1f1b9a4a2e81576fab612cb64eb91b7f2eb31b801d02124. | passed | public | evidence.jsonl |
