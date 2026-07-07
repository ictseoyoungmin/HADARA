# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `hadara@0.4.1-rc.0` package metadata, lockfile, README, release notes, release readiness docs, helper examples, and GitHub Release note draft are prepared. | `ev:T-0509:985a38847a4e47b6856f2280`, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, `GITHUB_RELEASE_NOTE.md` |
| Finalize-auto safety checks passed for clean auto close, blocker zero-write refusal, and stale close-source plan mismatch refusal. | `ev:T-0509:34a2f44b3e3e4918a551415a` |
| Release readiness checks passed: Docker package smoke, release artifact, clean-checkout smoke, strict release gate, release dry-run, and publish dry-run. | `ev:T-0509:c6e8cacc44814a249c5da181`, `ev:T-0509:580e544b0e2e4484b3fdacfb`, `ev:T-0509:9f1f8cbc00cc405384db41f3`, `ev:T-0509:8d224267508c4883ae29027a`, `ev:T-0509:5b14389630774f87b9481533` |
| The RC is not published yet; `npm view hadara@0.4.1-rc.0` returned E404. | `ev:T-0509:ff851321183342729b17293e` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run `bash scripts/release/prepare-publish-env.sh T-0509` from the source checkout, then publish from `/root/hadara-publish` inside `hadara-dev` with `bash scripts/release/manual-publish-rc.sh T-0509 --execute`. | Publish requires npm auth and explicit operator confirmation; this capsule intentionally performed no registry mutation. | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh`, `tasks/T-0509-0-4-1-rc0-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` |
| Optional: pass `--github-draft --github-release-note tasks/T-0509-0-4-1-rc0-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` during manual publish, or create/publish the GitHub draft after npm verification. | GitHub Release mutation remains separately reviewable. | `GITHUB_RELEASE_NOTE.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host Node `spawnSync` can return `EPERM` for installed subprocesses in this tool environment. | Host-local package smoke can report empty captured stdout and fail command-surface drift even though direct shell and Docker paths work. | Use Docker/ext4 package smoke as release-grade validation; transient failures are resolved by `ev:T-0509:b53a52f365724072a494f4ba`. |
| Release artifact refuses dirty worktrees by design. | Attaching evidence dirties the tree, so release artifact must run from a committed clean source state. | Commit source/evidence sync, rerun artifact, then commit evidence sync; publish helper uses a fresh clean clone. |
