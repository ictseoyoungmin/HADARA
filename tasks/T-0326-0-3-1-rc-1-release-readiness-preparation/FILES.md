# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `package.json` | Update | Bump package source version to `0.3.1-rc.1`. | Done |
| `package-lock.json` | Update | Align lockfile package metadata with `0.3.1-rc.1`. | Done |
| `dist/` | Refresh | Built CLI metadata must match package version before release evidence. | Done |
| `README.md` | Update | Concise release status with release-note links and rc1 package-facing wording. | Done |
| `docs/RELEASE_NOTES.md` | Update | Add `0.3.1-rc.1` release-note entry. | Done |
| `docs/RELEASE_READINESS.md` | Update | Track rc1 source/readiness state and T-0327/T-0328 boundaries. | Done |
| `scripts/release/manual-publish-rc.sh` | Update | Refresh usage examples to T-0327/current rc1 publish path if needed. | Done |
| `scripts/release/prepare-publish-env.sh` | Update | Refresh operator prep examples to T-0327/current rc1 publish path. | Done |
| `src/services/release-publish.ts` | Update | Accept patch-line `0.x.y` and `0.x.y-rc.N` package metadata for publish dry-run readiness. | Done |
| `src/services/operational-debt.ts` | Update | Align strict release gate package metadata check with patch-line rc versions. | Done |
| `tests/unit/init.test.ts` | Update | Align README release-status expectations with concise linked rc1 wording. | Done |
| `tests/unit/release-publish.test.ts` | Update | Cover stable patch and patch rc publishable metadata. | Done |
| `tests/unit/operational-debt.test.ts` | Update | Cover release gate patch rc metadata markers. | Done |
| `tests/unit/release-dry-run.test.ts` | Update | Align release readiness fixture marker with `0.x.y-rc.N`. | Done |
| `docs/TEST_STRATEGY.md` | Update | Align release metadata policy wording with patch-line RCs. | Done |
| `docs/TASK_BOARD.md` | Update | Track T-0326 lifecycle status. | In Progress |
| `docs/PROJECT_STATE.md` | Update | Reflect active/done rc1 readiness state and next publish/recycle capsules. | In Progress |
| `docs/AGENT_HANDOFF.md` | Update | Hand off T-0327/T-0328 after T-0326 readiness. | In Progress |
| `docs/DEVELOPMENT_SLICES.md` | Update | Add T-0326 release-readiness slice and next release capsules. | In Progress |
| `tasks/T-0326-0-3-1-rc-1-release-readiness-preparation/` | Update | Capsule docs, evidence, and release artifacts. | In Progress |
| `tasks/T-0327-0-3-1-rc-1-approval-gated-publish/` | Add | Pre-create next publish capsule so helper can validate T-0327/version alignment. | Done |
| `tasks/T-0328-0-3-1-rc-1-post-publish-installed-package-recycle/` | Add | Pre-create post-publish recycle capsule for next handoff. | Done |
