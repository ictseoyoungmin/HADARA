# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Stable `0.4.4` package metadata, README, Getting Started, release notes/readiness, helper examples, and GitHub Release note artifact were prepared. | `ev:T-0583:5518f956424c431a96f9206a` |
| Docker full suite/dist refresh, package smoke, clean-checkout smoke, docs doctor, and strict release gate passed. | `ev:T-0583:7124c5762ff64ec5b166cb69` |
| Docs registry profile semantics were hotfixed so document entry `profiles` uses only `basic`, `standard`, and `governed`; `hadara-dev` remains only as local project/owner metadata. | `ev:T-0583:5723e0f57f404a2cab627cef` |
| Package smoke passed after the registry hotfix; the sandbox npm-pack failure was resolved by an approved external rerun. | `ev:T-0583:f0ed9b5cb09f429198437689`, `ev:T-0583:308d82caa20f47a59cbc9415` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit source-prep/hotfix state, then rerun release artifact and release dry-run from the clean committed worktree. | Release artifact correctly blocks on a dirty worktree so commit metadata describes the artifact contents. | `TASK.md`, `GITHUB_RELEASE_NOTE.md`, `docs/RELEASE_READINESS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host focused release test hit `spawnSync bash EPERM`. | Host shell-launch restriction affects the test wrapper, not the release source. | Docker full suite passed and remains authoritative. |
| First package-smoke run hit npm cache `EROFS` in sandbox. | Sandbox npm cache was read-only, so `npm pack` produced no tarball. | Approved external rerun passed package smoke. |
| Release artifact failed before source-prep commit. | This is expected because artifact metadata requires a clean git worktree. | Commit source-prep state, rerun release artifact with `--attach-evidence`, then rerun release dry-run. |
| Do not add `hadara-dev` back to document entry `profiles`. | It reads as a product init profile and leaks internal HADARA-dev identity to downstream projects. | Use `projectProfile`, `owner`, `scope`, `readTier`, and `status` for local/internal/historical routing. |
