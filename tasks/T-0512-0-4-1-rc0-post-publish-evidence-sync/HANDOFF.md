# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| npm registry verification for `hadara@0.4.1-rc.0` passed after operator publish: `next=0.4.1-rc.0`, `latest=0.4.0`, shasum `8ced2baaf6bbc6e7d407fb9525cf6080109daa8f`. | `ev:T-0512:873cb873d9a74a2eb374d829` |
| GitHub Release `v0.4.1-rc.0` is public prerelease: `isDraft=false`, `isPrerelease=true`, target `5380df586c8deec1c4a2e504a6203e4a2b028500`. | `ev:T-0512:8de1c6fc2c0442fdbcbf65cc` |
| Shared state docs now point next release-line work at installed-package recycle. | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run installed-package recycle for `hadara@0.4.1-rc.0` from a fresh unmounted environment. | npm/GitHub publication is complete; consumer install proof remains the next release-line gate. | `docs/RELEASE_READINESS.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Release publish evidence from the publish clone is not automatically copied back into this workspace. | T-0509's clone-local evidence id `ev:T-0509:eb3bc44df0f4465384c02a40` is not present in this workspace's T-0509 files. | T-0512 records workspace-local npm/GitHub verification evidence instead; do not hand-edit clone-local `evidence.jsonl`. |
