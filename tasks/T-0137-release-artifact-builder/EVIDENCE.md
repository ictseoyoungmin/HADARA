# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-28T13:13:28Z | test-log | Docker focused release artifact/schema/tools tests passed: 4 files, 25 tests. | passed |
| 2026-05-28T13:14:42Z | test-log | Docker full `npm run check` passed with TypeScript build, 55 test files, and 392 tests. | passed |
| 2026-05-28T13:15:03Z | command-log | Docker built CLI `release artifact --execute --json --project /tmp/hadara --timeout 120` returned `ok: true`, generated tarball/checksum/manifest metadata, verified 111 package files under the whitelist, and reported no issues. | passed |
| 2026-05-28T13:15:16Z | command-log | Docker built CLI `release gate --mode strict --json --project /tmp/hadara` returned `ok: true`, 13 passed checks, and no issues. | passed |
| 2026-05-28T13:15:40Z | command-log | Docker built CLI `harness validate --task T-0137 --level done --json --project /tmp/hadara` returned `ok: true` with no issues. | passed |
