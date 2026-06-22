# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `bash scripts/release/manual-publish-rc.sh T-0406 --execute` | Approval-gated npm publish after npm login and typing `publish`. | Yes for publish completion | Passed | `ev:T-0406:8f35fa0295e34e93973136fa` |
| `npm view hadara@0.3.3 version --registry=https://registry.npmjs.org` | Verify exact registry version after publish. | Yes | Passed: `0.3.3` | `ev:T-0406:630c4761c6c44250943f86e0` |
| `npm view hadara dist-tags --json --registry=https://registry.npmjs.org` | Verify `latest` points to `0.3.3`. | Yes | Passed: `latest=0.3.3`, `next=0.3.3-rc.0` | `ev:T-0406:630c4761c6c44250943f86e0` |
| Temporary-prefix installed-bin smoke | Verify installed `hadara@0.3.3` reports version and runs help. | Yes | Passed | `ev:T-0406:b284424247cc414ba9787fc4` |
| `git diff --check` | Verify staged docs and capsule edits have no whitespace errors. | Yes before commit | Passed | `ev:T-0406:fc31d6e1d65a491da0210e85` |
| Stale publish wording scan | Verify package-facing and shared docs no longer contain pre-stable-publish wording. | Yes before commit | Passed | `ev:T-0406:fc31d6e1d65a491da0210e85` |
| `hadara task lifecycle --task T-0406 --json` | Confirm lifecycle reports the capsule as intentionally unfinished until publish proof exists. | Informational | Passed with expected finish-required phase | `ev:T-0406:fc31d6e1d65a491da0210e85` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| GitHub Release draft | No | Optional; not requested by default. | Not Run | `ev:T-0406:8f35fa0295e34e93973136fa` |
| Docker/PyPI publish | No | Out of scope for this npm publish capsule. | Not Run | Not applicable. |
