# Risks

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Running a future helper with a dirty worktree fails before publish. | Operator cannot publish immediately from uncommitted release-prep edits. | Medium | Commit or otherwise clean the future readiness state before `--execute`; the helper intentionally checks this. | Mitigated for T-0282. |
| Publishing from stale `dist/`. | npm package would not include the validated source behavior. | Low | T-0282 ran Docker build/check and synced workspace `dist` before publish; preserve this rule for future RCs. | Mitigated for T-0282. |
| Re-running T-0282 publish after npm already accepted rc2. | Immutable npm version publish would fail and could add confusing duplicate local evidence. | Medium | Do not rerun T-0282 publish; use a fresh capsule for post-publish recycle or the next RC. | Active carry-forward warning. |
| Confusing npm rc.2 with Python bridge rc.1. | Unplanned PyPI versioning/publish work. | Low | Keep Python bridge references historical/current and out of scope. | Mitigated. |
