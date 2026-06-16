# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `bash scripts/release/manual-publish-rc.sh T-0327 --execute` | Run the approval-gated publish helper after npm login and explicit confirmation. | Yes | Not Run | Pending. |
| `npm view hadara@0.3.1-rc.1 version --registry=https://registry.npmjs.org` | Verify registry visibility after publish. | Yes | Not Run | Pending. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| T-0328 installed-package recycle | No | Separate post-publish capsule. | Not Run | Deferred. |
