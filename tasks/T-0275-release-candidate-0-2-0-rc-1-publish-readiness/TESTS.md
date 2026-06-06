# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused release/schema tests | Run focused release/package/schema coverage in the reusable Docker flow. | Yes | Passed | Focused release/package/schema/init tests passed 8 files / 73 tests; feature-smoke focused test passed 1 file / 3 tests. |
| Docker full sync-build | Run full build/test and refresh workspace `dist`. | Yes | Passed | Docker full check passed 100 files / 680 tests and refreshed workspace `dist`. |
| Built CLI release/package smokes | Verify the built CLI emits rc.1 release/package readiness reports without publish mutation. | Yes | Passed | Release artifact, package smoke, clean-checkout smoke, release gate, release dry-run, and release publish dry-run passed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `bash -n scripts/release/manual-publish-rc.sh` | Yes | Operator will use this helper after npm login. | Passed | Syntax check passed. |
| `git diff --check` | Yes | Catch whitespace issues before release artifact generation. | Passed | Whitespace check passed. |
| `hadara package smoke --execute --attach-evidence --task T-0275 --json` | Yes | Fresh package-smoke evidence for rc.1. | Passed | `artifacts/package-smoke/2026-06-06T08-10-01.759Z-summary.json`. |
| `hadara smoke clean-checkout --execute --attach-evidence --task T-0275 --json` | Yes | Fresh clean-checkout evidence for rc.1. | Passed | `artifacts/clean-checkout-smoke/2026-06-06T08-11-32.445Z-summary.json`. |
| `hadara release artifact --execute --attach-evidence --task T-0275 --json` | Yes | Fresh release artifact evidence for the current source state. | Passed | Host run produced `dist-release/hadara-0.2.0-rc.1.tgz`, tarball hash `sha256:c9cbece2b7e967be2fd307fc75199d69213331493ddb0a0141f48dfda524ff5c`, manifest hash `sha256:aef2cd0e5472d6b137faabea3583d58fce5a9b192cc842ef621f990067d11472`, and `artifacts/release-artifact/2026-06-06T08-09-12.544Z-report.json`; earlier Docker attempt failed only on git safe.directory. |
| `hadara release dry-run --json` | Yes | Confirms strict release readiness without mutation. | Passed | Readiness `ready`, blockers 0, warnings 0, version `0.2.0-rc.1`, all planned release mutations `willExecute:false`. |
| `hadara release publish --mode dry-run --approval-actor local-operator --approval-reason "T-0275 rc.1 publish readiness verification only" --json` | Yes | Confirms approval-gated publish readiness without mutation. | Passed | Dry-run `ok:true`; token absence warnings only; publish/GitHub/Docker mutation flags false. |
| `npm view hadara@0.2.0-rc.1 version --registry=https://registry.npmjs.org` | Yes | Verify the immutable npm version does not already exist before operator publish. | Passed | Escalated registry read returned E404 no match for `hadara@0.2.0-rc.1`. |
| `curl -I --max-time 15 https://raw.githubusercontent.com/ictseoyoungmin/HADARA-dev/main/docs/assets/hadara_sub_right_name.png` | Yes | Verify the README raw image URL used by npm package rendering resolves. | Passed | HTTP 200; `git ls-files docs/assets/hadara_sub_right_name.png` returned the tracked asset path. |
| npm login / npm publish | No | Operator-only final mutation. | Not Run | Must be run by the operator after reviewing and committing this capsule. |
