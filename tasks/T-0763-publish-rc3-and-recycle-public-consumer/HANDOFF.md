# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0763 |
| Title | Publish RC3 and Recycle Public Consumer |
| Status | Done |
| Created | 2026-08-09T22:41 |
| Updated | 2026-08-11T14:05 |
## Last Completed

| Item | Evidence |
|---|---|
| Preflight artifact and all local gates passed; operator published npm `hadara@0.5.0-rc.3`; public `hadara@next` completed deep task lifecycle dogfooding; host `gh` marked `v0.5.0-rc.3` as prerelease. Custom asset parity was removed from acceptance. | ev:T-0763:84c5bf346e9748e4a61286d0; ev:T-0763:14975c72acda4514a8497233; ev:T-0763:04c70bb575b640cdb621f7c7; ev:T-0763:1d7c176c105247c6812ce55b; preflight tarball SHA-256 `843f582d000d69f2088ef4debd9b969150de3154935ea783961f58d06882eb53` |

## Pre-Close Operator Action

| Step | Reason | Required Reading |
|---|---|---|
| Run `hadara task close --task T-0763 --dry-run --json`, review readiness, then execute close if clean. | All revised acceptance criteria and external mutations are complete. | `docs/TASK_WORKFLOW_COMMANDS.md`; `TASK.md`; `DOGFOOD_REPORT.md` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run proof-last task close and confirm `closed-valid`. | The capsule is complete under the revised independent npm/GitHub acceptance. | `HANDOFF.md`; `docs/TASK_WORKFLOW_COMMANDS.md` |

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
gh release edit v0.5.0-rc.3 --repo ictseoyoungmin/HADARA --prerelease
gh release view v0.5.0-rc.3 --repo ictseoyoungmin/HADARA --json tagName,isDraft,isPrerelease,assets
```

After that, record: npm `next == 0.5.0-rc.3`, GitHub `isPrerelease=true`, all three release assets, fresh consumer install, init, doctor, task create, validation/evidence, close dry-run, close execute, audit `closed-valid`, same-close retry, fresh task status, and no stale continuation.

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| npm artifact provenance is independent from GitHub Release metadata. | A GitHub prerelease does not need to carry the npm tarball under the revised acceptance. | Keep the existing npm evidence immutable; do not regenerate it for GitHub. |
| GitHub release metadata was initially not marked prerelease. | This was corrected; custom asset parity is out of scope under the revised acceptance. | Preserve the npm artifact evidence independently and do not regenerate it for GitHub. |
