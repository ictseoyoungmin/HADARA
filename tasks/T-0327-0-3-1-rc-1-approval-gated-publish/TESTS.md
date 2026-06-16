# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `bash scripts/release/manual-publish-rc.sh T-0327 --execute` | Run the approval-gated publish helper after npm login and explicit confirmation. | Yes | Passed | `command:T-0327:npm-publish` |
| `npm view hadara@0.3.1-rc.1 version --registry=https://registry.npmjs.org` | Verify registry visibility after publish. | Yes | Passed | `command:T-0327:registry-tarball-verify` |
| Registry/tarball inspection for `hadara@0.3.1-rc.1` | Verify package page README source and tarball contents after npm visibility. | Yes | Passed | `command:T-0327:registry-tarball-verify` |
| `npm dist-tag ls hadara --registry=https://registry.npmjs.org` | Verify `latest=0.3.0` and `next=0.3.1-rc.1`. | Yes | Passed | `command:T-0327:npm-dist-tag-corrected` |
| `npm whoami --registry=https://registry.npmjs.org` | Verify npm auth is available before attempting dist-tag mutation. | Yes | Blocked | `command:T-0327:npm-dist-tag-auth-blocked`; returned E401 Unauthorized. |
| `bash -n scripts/release/manual-publish-rc.sh` | Validate helper syntax after npm tag hardening. | Yes | Passed | `command:T-0327:manual-publish-tag-hardening` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | Not needed; no security boundary changed. |
| T-0328 installed-package recycle | No | Separate post-publish capsule. | Not Run | Deferred. |
