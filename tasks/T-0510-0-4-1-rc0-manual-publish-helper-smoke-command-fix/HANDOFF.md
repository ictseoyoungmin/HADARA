# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `manual-publish-rc.sh` now uses canonical `smoke package` during fresh release evidence refresh. | `ev:T-0510:14f8ebc85ed5466ab51be7be` |
| Regression test prevents reintroducing `run_hadara package smoke --execute`. | `ev:T-0510:4fd82837a221488dbdc309b3` |
| Build passed after the helper fix. | `ev:T-0510:85f18464c12c47698a85df05` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit/push this fix, rerun `bash scripts/release/prepare-publish-env.sh T-0509`, then retry `bash scripts/release/manual-publish-rc.sh T-0509 --execute` from the fresh publish clone. | The previous publish clone contains the stale script and npm publish did not run. A fresh clone after this commit is the cleanest path. | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `--github-draft` still requires `gh` in the publish environment. | The first operator attempt stopped immediately because `gh` was not installed in the container. | Run npm-only publish first, or install/auth `gh` in the publish container before using `--github-draft`; GitHub draft can also be created later from the host checkout. |
| Host Vitest can hit `spawnSync bash EPERM`. | Host focused test may fail despite the script being valid. | Use Docker/ext4 focused test evidence for release helper validation. |
