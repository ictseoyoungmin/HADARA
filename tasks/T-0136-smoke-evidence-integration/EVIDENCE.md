# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-28T12:51:24Z | test-log | Docker focused smoke evidence tests passed: package-smoke, clean-checkout smoke, schema runtime, and schema fixtures; 4 files, 32 tests. | passed |
| 2026-05-28T12:52:34Z | test-log | Docker full `npm run check` passed with TypeScript build, 54 test files, and 386 tests. | passed |
| 2026-05-28T12:52:58Z | command-log | Docker built CLI `package smoke --execute --attach-evidence --task T-0136 --json --project /tmp/hadara --timeout 120` returned `ok: true`, attached public `artifacts/package-smoke/*-summary.json`, and reported no issues. | passed |
| 2026-05-28T12:53:26Z | command-log | Docker built CLI `smoke clean-checkout --execute --attach-evidence --task T-0136 --json --project /tmp/hadara --timeout 180` returned `ok: true`, attached public `artifacts/clean-checkout-smoke/*-summary.json`, and reported no issues. | passed |
| 2026-05-28T12:53:37Z | command-log | Docker built CLI `release gate --mode strict --json --project /tmp/hadara` returned `ok: true`, 13 passed checks, and no issues. | passed |
| 2026-05-28T12:54:05Z | command-log | Docker built CLI `harness validate --task T-0136 --level done --json --project /tmp/hadara` returned `ok: true` with no issues. | passed |
