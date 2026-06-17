# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-17T10:07:39.165Z | command-log | Initial T-0336 Docker sync-build blocked after version bump: README alignment test still expected prior rc table/install strings; no release artifact or publish mutation was run. | blocked | public | evidence.jsonl |
| 2026-06-17T10:07:50.529Z | command-log | T-0336 Docker sync-build passed after updating README alignment expectations: full suite passed 119 test files / 791 tests, packageVersion reported 0.3.2-rc.0, and distLooksStale:false. | passed | public | evidence.jsonl |
| 2026-06-17T10:08:02.612Z | command-log | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. (artifacts/release-artifact/2026-06-17T10-08-02.612Z-report.json) | failed | public | artifacts/release-artifact/2026-06-17T10-08-02.612Z-report.json |
