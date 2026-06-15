# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git diff --check` | Verify documentation whitespace before pre-publish commit. | Yes | Passed | `command:T-0316:prepublish-prep` |
| `bash -n scripts/release/manual-publish-rc.sh scripts/release/prepare-publish-env.sh` | Check publish helper shell syntax. | Yes | Passed | `command:T-0316:prepublish-prep` |
| `npx vitest run tests/unit/init.test.ts` | Verify README/init-profile expectations after package-facing README wording change. | Yes | Passed | `command:T-0316:readme-test-update`; Docker `/tmp/hadara` focused run passed 1 file / 21 tests. |
| `scripts/release/manual-publish-rc.sh T-0316 --execute` | Operator-run approval-gated npm publish helper. | Yes, before Done | Passed | `command:T-0316:npm-publish` |
| `npm view hadara@0.3.0 version --registry=https://registry.npmjs.org` | Registry verification after publish. | Yes, before Done | Passed | `command:T-0316:npm-publish`; helper observed `0.3.0` after one retry. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `task status --task T-0316 --json` | Confirm capsule is active and publish evidence remains pending before Done. | Yes | Passed with expected Done-level blockers | `command:T-0316:prepublish-prep` |
| Full Docker validation | No | T-0315 already ran full stable readiness; T-0316 pre-publish edits are package-facing docs only, and the helper reruns release gates before publish. | Not Run | T-0315 baseline |
| GitHub Release draft | Optional | Only if operator runs helper with `--github-draft`. | Not Run | Operator did not request a GitHub Release draft. |
| Installed-package recycle | No | Separate post-publish T-0317 follow-up. | Not Run | Out of scope |
