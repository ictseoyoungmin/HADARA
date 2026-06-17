# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0337 release capsule spec. | Done | `docs/AGENT_HANDOFF.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/specs/0.3.2/capsules/T-0337_0_3_2_rc0_Approval_Gated_Publish.md` |
| 2 | Open T-0337 capsule and replace scaffold placeholders with release-publish scope. | Done | `ev:T-0337:67d9ffcaf2b74ee1b2901ae1` |
| 2a | Review README release posture and add capsule-local release note. | Done | `RELEASE_NOTE.md` |
| 3 | Preserve publish mutation boundary until operator npm auth and explicit confirmation are available. | Pending | Manual helper handoff |
| 4 | After operator publish, verify npm version, dist-tags, tarball/README/package metadata. | Pending | npm registry checks |
| 5 | Attach publish/verification evidence and hand off T-0338 recycle. | Pending | `evidence add-command`, shared state docs |
