# Evidence

| Time | Kind | Summary | Result | Visibility | JSONL |
|---|---|---|---|---|---|
| 2026-06-17T12:56:24.344Z | command-log | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. (artifacts/release-artifact/2026-06-17T12-56-24.344Z-report.json) | failed | public | artifacts/release-artifact/2026-06-17T12-56-24.344Z-report.json |
| 2026-06-17T12:56:42.440Z | command-log | Package smoke local failed with reduced public evidence. (artifacts/package-smoke/2026-06-17T12-56-42.440Z-summary.json) | failed | public | artifacts/package-smoke/2026-06-17T12-56-42.440Z-summary.json |
| 2026-06-17T12:57:56.666Z | command-log | Package smoke local passed with reduced public evidence. (artifacts/package-smoke/2026-06-17T12-57-56.666Z-summary.json) | passed | public | artifacts/package-smoke/2026-06-17T12-57-56.666Z-summary.json |
| 2026-06-17T13:01:26.237Z | command-log | Clean-checkout smoke failed with reduced public evidence. (artifacts/clean-checkout-smoke/2026-06-17T13-01-26.237Z-summary.json) | failed | public | artifacts/clean-checkout-smoke/2026-06-17T13-01-26.237Z-summary.json |
| 2026-06-17T13:03:12.380Z | command-log | Clean-checkout smoke passed with reduced public evidence. (artifacts/clean-checkout-smoke/2026-06-17T13-03-12.380Z-summary.json) | passed | public | artifacts/clean-checkout-smoke/2026-06-17T13-03-12.380Z-summary.json |
| 2026-06-17T13:05:18.434Z | command-log | Docker dev:docker-sync-build passed for stable 0.3.2 after README test expectation update: npm run check passed 119 files / 791 tests and built CLI version smoke reported packageVersion 0.3.2 with distLooksStale false. | passed | public | evidence.jsonl |
| 2026-06-17T13:05:33.794Z | command-log | Strict release gate passed for stable 0.3.2 with current T-0340 package-smoke and clean-checkout evidence; release dry-run remains blocked until release artifact evidence is refreshed for 0.3.2 from a clean git worktree. | passed | public | evidence.jsonl |
| 2026-06-17T13:11:17.523Z | command-log | Live npm registry pre-publish check: npm view hadara@0.3.2 version returned E404 No match found, so the stable 0.3.2 version is not currently published. Initial sandbox lookup hit DNS EAI_AGAIN; escalated network lookup completed. | passed | public | evidence.jsonl |
