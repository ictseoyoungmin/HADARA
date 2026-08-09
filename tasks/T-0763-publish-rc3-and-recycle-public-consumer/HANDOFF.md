# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0763 |
| Title | Publish RC3 and Recycle Public Consumer |
| Status | Draft |
| Created | 2026-08-09T22:41 |
| Updated | 2026-08-09T22:41 |

## Last Completed

| Item | Evidence |
|---|---|
| Preflight artifact and all local gates passed; operator published npm `hadara@0.5.0-rc.3` and public `hadara@next` resolves to `0.5.0-rc.3`. Read-only GitHub verification found `v0.5.0-rc.3` is not a prerelease and has no assets. | ev:T-0763:84c5bf346e9748e4a61286d0; ev:T-0763:f6c9879e8ad7453dbc88ace5; ev:T-0763:e65676daf07649f69624dfd4; ev:T-0763:43796b9113ff4961a6ee82bc; ev:T-0763:0bd3e18ee8494dde83167b71; ev:T-0763:146d2746d9804bccbf0fac09; ev:T-0763:58578ea3cb38403283b90c64; ev:T-0763:4e57d6cc591649488d6053a1; ev:T-0763:9d34929d0f82454aaf4d553b; ev:T-0763:a3ca34fc604a4b0f8aa52e0c; preflight tarball SHA-256 `843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53`; checksum-file SHA-256 `fe89b68ca6e773f36a21b3b166a06012a51dbbad634e1513a75eeb9e2aecd4a7`; manifest-file SHA-256 `eb52a65efc728be7ef1434670b7ab547b55f5c08f8252aae6cf037d07d35c903` |

## Pre-Close Operator Action

| Step | Reason | Required Reading |
|---|---|---|
| Attach the retained `.tgz`, `.sha256`, and manifest to `v0.5.0-rc.3`, mark it as a prerelease, verify GitHub/npm metadata, then run the public consumer recycle. | npm publication is complete, but the current GitHub release metadata is `isPrerelease=false` with no assets, and AC-5 still needs lifecycle evidence. | `docs/RELEASE_READINESS.md`; `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md`; `scripts/release/manual-publish-rc.sh` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| The operator reuses the retained final artifact set to attach the three release files, marks `v0.5.0-rc.3` prerelease, verifies `isPrerelease=true`, then runs the public consumer recycle and records close/audit/retry/status evidence. | npm is already published and verified; do not regenerate the tarball. | `HANDOFF.md`; `scripts/release/manual-publish-rc.sh`; `docs/RELEASE_READINESS.md` |

## Operator Publish / Public Consumer Sequence

The operator must retain one final artifact set and use it throughout:

```sh
scripts/release/prepare-publish-env.sh T-0763
# inside the prepared clean clone, after npm login and review:
scripts/release/manual-publish-rc.sh T-0763 --execute --github-draft --github-release-note tasks/T-0763-publish-rc3-and-recycle-public-consumer/GITHUB_RELEASE_NOTE.md
npm view hadara@0.5.0-rc.3 version --registry=https://registry.npmjs.org
gh release view v0.5.0-rc.3 --repo ictseoyoungmin/HADARA --json tagName,isDraft,isPrerelease,assets
node --import tsx tools/dev-surfaces.ts package recycle --execute --package hadara@next --expected-version 0.5.0-rc.3 --source-root /root/hadara-publish --evidence-root /workspace --smoke-project-root /tmp/hadara-t0763-public-consumer --attach-evidence --task T-0763 --json
```

Before public recycle, repair the GitHub release with the exact retained files and prerelease flag, then verify:

```sh
gh release upload v0.5.0-rc.3 "$ARTIFACT_DIR"/hadara-0.5.0-rc.3.tgz "$ARTIFACT_DIR"/hadara-0.5.0-rc.3.tgz.sha256 "$ARTIFACT_DIR"/hadara-0.5.0-rc.3.tgz.manifest.json --repo ictseoyoungmin/HADARA --clobber
gh release edit v0.5.0-rc.3 --repo ictseoyoungmin/HADARA --prerelease
gh release view v0.5.0-rc.3 --repo ictseoyoungmin/HADARA --json tagName,isDraft,isPrerelease,assets
```

After that, record: npm `next == 0.5.0-rc.3`, GitHub `isPrerelease=true`, all three release assets, fresh consumer install, init, doctor, task create, validation/evidence, close dry-run, close execute, audit `closed-valid`, same-close retry, fresh task status, and no stale continuation.

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The exact tarball must not be regenerated between smoke, npm publish, and GitHub upload. | A regenerated artifact breaks provenance and may not match the smoke evidence. | Retain the `.tgz`, `.sha256`, and manifest from one artifact run and reuse those exact files. |
| GitHub release metadata does not currently satisfy the RC3 prerelease contract. | RC3 is not complete until the operator uploads the exact three files, sets `isPrerelease=true`, and records public consumer lifecycle evidence. | Repair `v0.5.0-rc.3` before recycle; do not regenerate the artifact. |
