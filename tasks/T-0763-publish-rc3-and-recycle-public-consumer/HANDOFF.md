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
| Preflight artifact, exact tarball package smoke, clean-checkout smoke, full check, strict gate, release/publish dry-runs, and exact-tarball npm publish dry-run passed; no prepare/publish/recycle command has been executed. | ev:T-0763:84c5bf346e9748e4a61286d0; ev:T-0763:f6c9879e8ad7453dbc88ace5; ev:T-0763:e65676daf07649f69624dfd4; ev:T-0763:43796b9113ff4961a6ee82bc; ev:T-0763:0bd3e18ee8494dde83167b71; ev:T-0763:146d2746d9804bccbf0fac09; ev:T-0763:58578ea3cb38403283b90c64; ev:T-0763:4e57d6cc591649488d6053a1; preflight tarball SHA-256 `843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53`; checksum-file SHA-256 `fe89b68ca6e773f36a21b3b166a06012a51dbbad634e1513a75eeb9e2aecd4a7`; manifest-file SHA-256 `eb52a65efc728be7ef1434670b7ab547b55f5c08f8252aae6cf037d07d35c903` |

## Pre-Close Operator Action

| Step | Reason | Required Reading |
|---|---|---|
| Run the pre-publish artifact, exact-tarball smoke, clean-checkout, full check, strict/dry-run gates, then review the exact operator handoff. | T-0763 must bind npm/GitHub/public consumer steps to one retained tarball while keeping external mutation operator-controlled. | `docs/RELEASE_READINESS.md`; `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md`; `scripts/release/prepare-publish-env.sh`; `scripts/release/manual-publish-rc.sh` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| The operator runs `scripts/release/prepare-publish-env.sh T-0763`, reviews its newly generated final artifact, and then runs the reviewed publish helper. | This session intentionally does not mutate npm, GitHub, or public consumer state; the `/tmp` artifact is preflight evidence, while the operator helper must retain and reuse its own final artifact set. | `HANDOFF.md`; `scripts/release/prepare-publish-env.sh`; `scripts/release/manual-publish-rc.sh` |

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

After public recycle, record: npm `next == 0.5.0-rc.3`, GitHub `isPrerelease=true`, fresh consumer install, init, doctor, task create, validation/evidence, close dry-run, close execute, audit `closed-valid`, same-close retry, fresh task status, and no stale continuation. These external results are not claimed until the operator supplies them.

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The exact tarball must not be regenerated between smoke, npm publish, and GitHub upload. | A regenerated artifact breaks provenance and may not match the smoke evidence. | Retain the `.tgz`, `.sha256`, and manifest from one artifact run and reuse those exact files. |
| Public consumer lifecycle is intentionally not executed in this session. | RC3 is not complete until the operator records public npm/GitHub and lifecycle evidence. | Run the handoff commands after reviewing the prepared environment, then append operator evidence to T-0763. |
