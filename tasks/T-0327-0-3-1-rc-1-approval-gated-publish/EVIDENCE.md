# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-16T09:53:55.052Z | command-log | Verified npm registry and tarball for hadara@0.3.1-rc.1: registry version is 0.3.1-rc.1, root README is present as README.md, tarball fileCount is 213, and tarball contains package/README.md and package/package.json. | passed | public | evidence.jsonl |
| 2026-06-16T09:53:55.052Z | command-log | Published hadara@0.3.1-rc.1 to npm via the approval-gated manual helper at 2026-06-16T09:42:18.965Z; helper output verified npm view returned 0.3.1-rc.1 and GitHub Release draft was not requested. | passed | public | evidence.jsonl |
| 2026-06-16T09:53:55.052Z | command-log | Observed npm dist-tag drift after RC publish: registry reported latest=0.3.1-rc.1. A dist-tag correction is required so stable latest remains 0.3.0 and RC is available as next. | failed | public | evidence.jsonl |
| 2026-06-16T09:54:48.671Z | command-log | Hardened scripts/release/manual-publish-rc.sh so rc versions default to npm tag next and stable versions default to latest; bash -n scripts/release/manual-publish-rc.sh passed. | passed | public | evidence.jsonl |
| 2026-06-16T10:58:26.149Z | command-log | Verified npm registry dist-tag still points latest to 0.3.1-rc.1; npm whoami returned E401 Unauthorized, so dist-tag correction is blocked until the operator logs in and supplies OTP/auth. | blocked | public | evidence.jsonl |
| 2026-06-16T12:00:07.470Z | command-log | Verified npm dist-tags after operator correction: latest=0.3.0 and next=0.3.1-rc.1 on registry.npmjs.org. | passed | public | evidence.jsonl |
| 2026-06-16T12:06:44.573Z | command-log | Task close validation for T-0327 returned ok:true before close evidence append; reportHash sha256:8e365d1287a2846c148bbfe5ef22a9fa8477c1b4eaee3d5488c0ef5319a9e3da; sourceHash sha256:d00b28e0542b56e9cce40a5add8fe8ce0d04bd2ff15556486658e94bf9491bef. | passed | public | evidence.jsonl |
