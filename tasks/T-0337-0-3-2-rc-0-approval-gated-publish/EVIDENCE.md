# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-17T10:59:43.182Z | command-log | Opened T-0337 approval-gated publish capsule, aligned task/shared handoff docs, and verified git diff --check passed; publish mutation remains pending operator npm auth and explicit confirmation. | passed | public | evidence.jsonl |
| 2026-06-17T11:08:09.603Z | command-log | Reviewed README release posture for 0.3.2-rc.0 and added capsule-local RELEASE_NOTE.md describing Evidence v2 changes, compatibility notes, deferred scope, and release boundaries. | passed | public | evidence.jsonl |
| 2026-06-17T11:19:13.516Z | command-log | Operator published hadara@0.3.2-rc.0 to npm with dist-tag next; helper verified npm view returned 0.3.2-rc.0; GitHub Release draft requested: false. | passed | public | evidence.jsonl |
| 2026-06-17T11:19:14.110Z | command-log | Verified npm registry after publish: npm view hadara@0.3.2-rc.0 version returned 0.3.2-rc.0; dist-tags returned latest=0.3.0 and next=0.3.2-rc.0; package metadata exposes README.md and tarball hadara-0.3.2-rc.0.tgz. | passed | public | evidence.jsonl |
| 2026-06-17T11:24:03.727Z | command-log | Final T-0337 close-prep checks passed: task ready --level done returned ready=true with 0 blockers/0 warnings, and git diff --check passed after publish/recycle handoff docs. | passed | public | evidence.jsonl |
| 2026-06-17T11:25:09.556Z | command-log | Task close validation for T-0337 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:30eb406f16e518ee6ef5406bcfce042c7d275b7d2a3d749d1cc6dd1645ef13ea. | passed | public | evidence.jsonl |
