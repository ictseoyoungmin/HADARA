# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Confirm T-0326 is closed, committed, and release readiness is green. | Pending | T-0326 close/audit and commit. |
| 2 | Prepare a clean publish clone if needed. | Pending | `bash scripts/release/prepare-publish-env.sh T-0327`. |
| 3 | Run approval-gated helper execute after npm login. | Pending | `bash scripts/release/manual-publish-rc.sh T-0327 --execute`; type `publish`. |
| 4 | Verify npm registry visibility. | Pending | `npm view hadara@0.3.1-rc.1 version --registry=https://registry.npmjs.org`. |
| 5 | Update docs/evidence and hand off to T-0328. | Pending | T-0327 evidence, release readiness, state docs. |
