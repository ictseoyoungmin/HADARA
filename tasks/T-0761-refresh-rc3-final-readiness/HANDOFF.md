# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0761 |
| Title | Refresh RC3 Final Readiness |
| Status | Done |
| Created | 2026-08-09T21:25 |
| Updated | 2026-08-09T21:35 |
## Last Completed

| Item | Evidence |
|---|---|
| Current-HEAD artifact, exact tarball package smoke, clean-checkout smoke, full check, strict gate, release dry-run, and publish dry-run passed; no release mutation was executed. | ev:T-0761:5ad65cc3c0bd47eeabb6c697; ev:T-0761:3ea412124e9044079edabd1d; ev:T-0761:257b635afb2a4d3ea9fc8c98; ev:T-0761:4626bb2935134a84beb34ef4; ev:T-0761:c7ab31e649cf41e2b6122074; ev:T-0761:c5f6c9222d5d486f80aff945; ev:T-0761:db676098038f40bbae98329d |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Review the completed evidence and execute the HADARA close transaction. | All required RC3 readiness proofs and the operator sequence are recorded. | `docs/RELEASE_READINESS.md`; `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md`; `scripts/release/manual-publish-rc.sh` |

## Operator Publish / Recycle Sequence

The final operator run must generate one retained tarball, use that exact tarball for package smoke, and publish/upload the same tarball, checksum, and manifest without regeneration:

```sh
scripts/release/manual-publish-rc.sh T-0761 --execute --github-draft --github-release-note GITHUB_RELEASE_NOTE.md
npm view hadara@0.5.0-rc.3 version --registry=https://registry.npmjs.org
gh release view v0.5.0-rc.3 --repo ictseoyoungmin/HADARA --json tagName,isDraft,isPrerelease,assets
node --import tsx tools/dev-surfaces.ts package recycle --execute --package hadara@next --expected-version 0.5.0-rc.3 --json
```

The helper owns the final artifact, exact-tarball smoke, gates, npm publish, and GitHub asset upload. Actual mutations and installed consumer recycle remain outside T-0761 and require operator control.

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The exact artifact generated for this refresh is disposable until an operator retains it. | T-0761 evidence records hashes/metadata only; publish must use one freshly generated tarball throughout the operator sequence. | Operator helper must generate one final tarball, run exact-tarball smoke, then publish and attach that same tarball/checksum/manifest without regeneration. |
