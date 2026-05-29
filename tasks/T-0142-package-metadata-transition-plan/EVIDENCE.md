# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-29T00:56:41.077Z | command-log | Package smoke local passed with reduced public evidence. (artifacts/package-smoke/2026-05-29T00-56-41.077Z-summary.json) | passed |
| 2026-05-29T00:57:53.354Z | command-log | Clean-checkout smoke failed with reduced public evidence. (artifacts/clean-checkout-smoke/2026-05-29T00-57-53.354Z-summary.json) | failed |
| 2026-05-29T00:58:22.162Z | command-log | hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1. (artifacts/release-artifact/2026-05-29T00-58-22.162Z-report.json) | passed |
| 2026-05-29T00:59:20.837Z | command-log | Clean-checkout smoke failed with reduced public evidence. (artifacts/clean-checkout-smoke/2026-05-29T00-59-20.837Z-summary.json) | failed |
| 2026-05-29T01:01:42.779Z | command-log | Clean-checkout smoke passed with reduced public evidence. (artifacts/clean-checkout-smoke/2026-05-29T01-01-42.779Z-summary.json) | passed |
| 2026-05-29T01:06:02Z | command-log | Docker focused `npx vitest run tests/unit/operational-debt.test.ts tests/unit/release-dry-run.test.ts tests/unit/release-publish.test.ts` passed with 3 files and 29 tests. | passed |
| 2026-05-29T01:06:02Z | command-log | Docker temp-copy strict release gate passed after T-0142 release-candidate metadata and evidence refresh. | passed |
| 2026-05-29T01:06:02Z | command-log | Docker built CLI `release dry-run --json --project /workspace` returned `ok: true` for version `0.1.0-rc.0` with fresh T-0142 evidence. | passed |
| 2026-05-29T01:06:02Z | command-log | Docker built CLI `release publish --mode dry-run --json --project /workspace` returned `ok: true`, passed package metadata readiness, warned only for missing token presence, and kept all mutation flags false. | passed |
| 2026-05-29T01:06:02Z | command-log | Docker temp-copy `npm run check` passed with TypeScript build, 57 test files, and 403 tests. | passed |
| 2026-05-29T01:13:16Z | command-log | Final Docker focused regression passed with 3 files and 29 tests after making release gate smoke evidence matching accept reduced evidence artifact paths. | passed |
| 2026-05-29T01:13:16Z | command-log | Final Docker strict release gate returned `ok: true` and reported T-0142 package-smoke, clean-checkout, and release-artifact evidence as latest schema-valid artifacts. | passed |
| 2026-05-29T01:13:16Z | command-log | Final Docker release dry-run and release publish dry-run returned `ok: true`; publish dry-run kept all release target `willExecute` flags false and warned only for missing token presence. | passed |
| 2026-05-29T01:13:16Z | command-log | Final Docker done-level harness validation for T-0142 returned `ok: true` with no issues. | passed |
| 2026-05-29T01:17:31Z | command-log | Final Docker focused regression passed with 3 files and 30 tests after adding reduced evidence artifact-path coverage. | passed |
| 2026-05-29T01:17:31Z | command-log | Final Docker temp-copy `npm run check` passed with TypeScript build, 57 test files, and 404 tests. | passed |
