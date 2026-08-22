# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0797 |
| Title | Publish the retained RC6 bytes to npm next and prepare GitHub draft and public package recycle |
| Status | Draft |
| Created | 2026-08-23T00:12 |
| Updated | 2026-08-23T00:12 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

## Last Completed

| Item | Evidence |
|---|---|
| T-0797 capsule created and bound to the exact T-0796 artifact. | T-0796 `ev:T-0796:ac12337f30834c0eb91ba498` |
| Retained files are available at `.hadara/local/release-workspace/T-0796/0.5.0-rc.6`; the release journal is `.hadara/local/release-results/T-0796/artifact.json`. | Tarball `sha256:f078d6edc4529943dd0842b787a6dc98fb04e4bdbefbd7e138dbcfe6c4202e1f`; checksum `sha256:73bec0e80788bad6f2ebc44b9fb3d9edf4ffeaf8ef725aad8f2a7c8d67dca715`; manifest `sha256:f1e742c427ca274fb1832f6e6100bdf54fd7213989d68b2ff639e9294f58c44a` |
| Current source release-input hash matches the retained artifact: `sha256:a2ad5b5a2e058ecb958eaf0fcf5846f586b032320760868f294f7dd84754681b`. | T-0796 artifact report |
| Publish helper syntax/help and retained-input preflight passed without mutation. | `ev:T-0797:de1b9887b3e2428fb7d4d7e9` |
| First operator attempt stopped before mutation on Docker-owned `dist/` (`EACCES`); the old generated directory was preserved outside the source inputs, replaced with a user-owned build directory, and `npm run build` passed. | `ev:T-0797:18716ecddf8c441fb5c6f341` (failed); `ev:T-0797:081ce35ded7d41f082600ee9` (resolved) |

## Pre-Close Operator Action

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Authenticate npm and GitHub, then run the exact command below from the repository root. | actionable | no | This is the only remaining operator action for this capsule. | `scripts/release/manual-publish-rc.sh`; `docs/RELEASE_READINESS.md`; T-0796 evidence |

### Operator command

```bash
bash scripts/release/manual-publish-rc.sh T-0797 \
  --execute \
  --github-draft \
  --npm-tag next \
  --retained-artifact-dir "$PWD/.hadara/local/release-workspace/T-0796/0.5.0-rc.6" \
  --retained-artifact-report "$PWD/.hadara/local/release-results/T-0796/artifact.json" \
  --github-release-note tasks/T-0797-publish-the-retained-rc6-bytes-to-npm-next-and-prepare-github-dr/GITHUB_RELEASE_NOTE.md \
  --github-repo ictseoyoungmin/HADARA \
  --git-remote-url https://github.com/ictseoyoungmin/HADARA.git
```

Before running, `npm whoami --registry=https://registry.npmjs.org` and `gh auth status` must succeed. The helper will ask for the exact confirmations `publish` and then `github-draft`; review each prompt before typing it. Do not run `npm publish` separately and do not regenerate the artifact.

## Post-Close Continuation

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| After npm/GitHub completion, publish the reviewed draft publicly only with an explicit human decision. | actionable | yes | `gh release edit ... --draft=false` is a separate public mutation. | `GITHUB_RELEASE_NOTE.md`; `docs/RELEASE_READINESS.md` |
| After the public release decision, create a separate installed-package recycle capsule. | actionable | yes | Consumer installation/recycle is outside this operator mutation capsule. | `docs/RELEASE_READINESS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Docker-generated `dist/` ownership caused the first local validation attempt to stop. | The helper did not reach npm or GitHub mutation. | User-owned `dist/` was regenerated and build verification passed; rerun the same prepared command. |
