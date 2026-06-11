# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/manual-publish-script.test.ts tests/unit/init.test.ts tests/unit/release-artifact.test.ts` | Cover publish helper hardening, README rc.1 expectation, and release artifact metadata staging. | Yes | Passed | Docker focused tests passed 3 files / 31 tests. |
| Docker `npm run check` in git-listed `/tmp/hadara`, then dist refresh and built CLI version smoke | Full Docker validation and refresh workspace `dist` after package/script changes. | Yes | Passed with known standalone retry | `npm run check` built TypeScript and passed 115 files / 743 tests, with one dashboard-static parallel timeout; standalone dashboard-static passed 1 file / 15 tests; built CLI version smoke returned `0.3.0-rc.1` and `distLooksStale:false`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `node dist/cli/main.js release artifact --execute --json --output dist-release --attach-evidence --task T-0298` | Generate rc.1 release artifact evidence from current built CLI. | Yes | Not Run | TBD |
| `tar -xOf dist-release/hadara-0.3.0-rc.1.tgz package/package.json` | Inspect exact tarball package metadata before operator publish. | Yes | Not Run | TBD |
| `npm publish dist-release/hadara-0.3.0-rc.1.tgz --dry-run --registry=https://registry.npmjs.org` | Confirm npm dry-run sees the exact tarball that would be published without registry mutation. | Yes | Not Run | TBD |
