# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `node dist/cli/main.js dev docker-check --focused ... --full --json` | Focused release/schema/task workflow coverage plus full repository check. | Yes | Passed | Evidence at 2026-06-05T10:47:39Z. |
| `node dist/cli/main.js dev docker-check --focused ... --sync-dist --before-hash ... --json` | Build/sync current CLI output with before-hash guard. | Yes | Passed | Evidence at 2026-06-05T10:47:39Z, 11:29:16Z, and 11:36:28Z. |
| `node dist/cli/main.js package smoke --execute --attach-evidence --task T-0268 --json` | Verify installable npm package smoke without publish. | Yes | Passed | Public package-smoke artifact at 2026-06-05T11:09:39.430Z. |
| `node dist/cli/main.js smoke clean-checkout --execute --attach-evidence --task T-0268 --json` | Verify clean checkout install/build/check/built CLI gate. | Yes | Passed | Public clean-checkout artifact at 2026-06-05T11:38:43.197Z. |
| `node dist/cli/main.js release artifact --execute --attach-evidence --task T-0268 --json` | Generate local tarball/checksum/manifest report evidence. | Yes | Passed | Public release-artifact artifact at 2026-06-05T11:41:43.771Z. |
| `node dist/cli/main.js release dry-run --json` | Verify final release readiness without mutation. | Yes | Passed | Evidence at 2026-06-05T11:43:18Z and 11:44:58Z. |
| `node dist/cli/main.js release publish --mode dry-run ... --json` | Verify publish gate without executing release mutation. | Yes | Passed | Evidence at 2026-06-05T11:43:29Z. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Package-smoke empty stdout fallback | Yes | Environment captured empty Node child stdout while exit codes remained reliable. | Passed | Focused Docker package-smoke tests. |
| Generalized RC metadata marker | Yes | Next RC target is `0.2.0-rc.0`, not `0.1.0-rc.N`. | Passed | Strict release gate and focused operational-debt/release-publish tests. |
| No mutation boundary | Yes | Reviewer forbade publish/deploy/registry/GitHub/Docker/PyPI mutation. | Passed | Release artifact and publish dry-run reports. |
