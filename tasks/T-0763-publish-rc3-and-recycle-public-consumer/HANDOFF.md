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
| Preflight artifact and all local gates passed; operator published npm `hadara@0.5.0-rc.3`; public `hadara@next` installed and completed deep task lifecycle dogfooding. Read-only GitHub verification still finds `v0.5.0-rc.3` is not a prerelease and has no assets. | ev:T-0763:84c5bf346e9748e4a61286d0; ev:T-0763:14975c72acda4514a8497233; ev:T-0763:04c70bb575b640cdb621f7c7; ev:T-0763:a3ca34fc604a4b0f8aa52e0c; preflight tarball SHA-256 `843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53` |

## Pre-Close Operator Action

| Step | Reason | Required Reading |
|---|---|---|
| Attach the retained `.tgz`, `.sha256`, and manifest to `v0.5.0-rc.3`, mark it as a prerelease, and verify GitHub metadata/assets. | npm publication and public consumer lifecycle dogfooding are complete; only the GitHub release contract remains open. | `docs/RELEASE_READINESS.md`; `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md`; `scripts/release/manual-publish-rc.sh`; `DOGFOOD_REPORT.md` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| The operator reuses the retained final artifact set to attach the three release files, marks `v0.5.0-rc.3` prerelease, and verifies `isPrerelease=true` with all assets. | npm and installed consumer verification are already complete; do not regenerate the tarball or rerun consumer mutation unless a new comparative run is desired. | `HANDOFF.md`; `scripts/release/manual-publish-rc.sh`; `docs/RELEASE_READINESS.md` |

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
