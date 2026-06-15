# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git diff --check` | Verify documentation whitespace before pre-publish commit. | Yes | Passed | `command:T-0316:prepublish-prep` |
| `bash -n scripts/release/manual-publish-rc.sh scripts/release/prepare-publish-env.sh` | Check publish helper shell syntax. | Yes | Passed | `command:T-0316:prepublish-prep` |
| `scripts/release/manual-publish-rc.sh T-0316 --execute` | Operator-run approval-gated npm publish helper. | Yes, before Done | Not Run | Pending operator npm login |
| `npm view hadara@0.3.0 version --registry=https://registry.npmjs.org` | Registry verification after publish. | Yes, before Done | Not Run | Pending operator output |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `task status --task T-0316 --json` | Confirm capsule is active and publish evidence remains pending before Done. | Yes | Passed with expected Done-level blockers | `command:T-0316:prepublish-prep` |
| Full Docker validation | No | T-0315 already ran full stable readiness; T-0316 pre-publish edits are package-facing docs only, and the helper reruns release gates before publish. | Not Run | T-0315 baseline |
| GitHub Release draft | Optional | Only if operator runs helper with `--github-draft`. | Not Run | Pending operator choice |
| Installed-package recycle | No | Separate post-publish T-0317 follow-up. | Not Run | Out of scope |
