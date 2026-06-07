# Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Running the helper with a dirty worktree fails before publish. | Operator cannot publish immediately from uncommitted release-prep edits. | Commit or otherwise clean the T-0282 readiness state before `--execute`; the helper intentionally checks this. |
| Publishing from stale `dist/`. | npm package would not include the validated source behavior. | Run Docker build/check and sync workspace `dist` before completion. |
| Accidentally publishing during readiness work. | Registry mutation before operator approval. | Do not run `manual-publish-rc.sh --execute` or type `publish`; use non-mutating checks only. |
| Confusing npm rc.2 with Python bridge rc.1. | Unplanned PyPI versioning/publish work. | Keep Python bridge references historical/current and out of scope. |

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
