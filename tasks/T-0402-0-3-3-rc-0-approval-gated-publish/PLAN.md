# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs, T-0401 readiness evidence, T-0337/T-0340 publish patterns, and manual helper behavior. | Done | T-0402 context docs |
| 2 | Open T-0402 capsule and replace scaffold placeholders with approval-gated publish scope. | Done | TASK/PLAN/CONTEXT/DECISIONS/RISKS/FILES/TESTS/ACCEPTANCE/HANDOFF |
| 3 | Keep actual npm publish blocked on operator npm auth and helper `publish` confirmation. | Pending | `npm login`; `bash scripts/release/manual-publish-rc.sh T-0402 --execute` |
| 4 | After publish, verify registry version, dist-tags, tarball/README/package metadata, and installed-package execution as feasible. | Pending | npm view/dist-tags/tarball/install evidence |
| 5 | Attach publish/verification evidence, update release docs/shared state, and close T-0402. | Pending | evidence + finalize |
