# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Confirm T-0326 is closed, committed, and release readiness is green. | Done | T-0326 close/audit and commit completed before publish. |
| 2 | Prepare a clean publish clone if needed. | Done | Publish ran from the prepared container clone at `/root/hadara-publish`. |
| 3 | Run approval-gated helper execute after npm login. | Done | `command:T-0327:npm-publish` |
| 4 | Verify npm registry visibility and package contents. | Done | `command:T-0327:registry-tarball-verify` |
| 5 | Correct npm dist-tags so stable remains `latest` and rc1 is `next`. | Done | `command:T-0327:npm-dist-tag-corrected` |
| 6 | Update docs/evidence and hand off to T-0328. | Done | T-0327 evidence, release readiness, Project State, Agent Handoff, and close/audit workflow. |
