# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git diff --check` | Check whitespace in capsule/shared-doc setup edits. | No | Passed | `ev:T-0337:67d9ffcaf2b74ee1b2901ae1` |
| `node dist/cli/main.js task status --task T-0337 --json` | Confirm task status report generates and expected publish blockers remain. | No | Passed with expected in-progress blockers | `ev:T-0337:67d9ffcaf2b74ee1b2901ae1` |
| `scripts/release/manual-publish-rc.sh T-0337` | Final validation, artifact/smoke evidence refresh, release gates, and npm publish dry-run without registry mutation. | Yes | Passed during helper flow | `ev:T-0337:26b2d2a2606c40ab81ca31f3` |
| `scripts/release/manual-publish-rc.sh T-0337 --execute` | Approval-gated npm publish after interactive confirmation. | Yes | Passed; npm publish completed | `ev:T-0337:26b2d2a2606c40ab81ca31f3` |
| `npm view hadara@0.3.2-rc.0 version --registry=https://registry.npmjs.org` | Verify published rc0 visibility. | Yes | Passed: `0.3.2-rc.0` | `ev:T-0337:ba28cd4d16fb4952ab3aefd7` |
| `npm view hadara dist-tags --json --registry=https://registry.npmjs.org` | Verify `next` and `latest` tags. | Yes | Passed: `latest=0.3.0`, `next=0.3.2-rc.0` | `ev:T-0337:ba28cd4d16fb4952ab3aefd7` |
| `npm view hadara@0.3.2-rc.0 dist.tarball readmeFilename version name --json --registry=https://registry.npmjs.org` | Verify package metadata, tarball URL, and README visibility. | Yes | Passed: `README.md`, `hadara-0.3.2-rc.0.tgz` | `ev:T-0337:ba28cd4d16fb4952ab3aefd7` |
| `node dist/cli/main.js task ready --task T-0337 --level done --json` | Verify done-level readiness before close. | Yes | Passed: ready true, 0 blockers, 0 warnings | `ev:T-0337:d23bb3db3fd9407e9b125931` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| GitHub Release draft | No | Only if explicitly requested. | Not Run | Helper skipped draft; `ev:T-0337:26b2d2a2606c40ab81ca31f3` |
| Installed-package recycle | No | Owned by T-0338. | Not Run | T-0338 capsule created |
