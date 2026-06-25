# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read release readiness, release notes, T-0417 handoff/evidence, and publish helper scripts. | Done | T-0417 closed-valid; helper requires the target version in this TASK.md. |
| 2 | Confirm npm registry pre-publish state for `hadara@0.3.4-rc.0`. | Done | npm registry reports exact version missing; dist-tags `latest=0.3.3`, `next=0.3.3-rc.0`. |
| 3 | Run publish dry-run/readiness without mutation. | Done | ext4 `release publish --mode dry-run` returned `ok:true` with expected token/approval warnings and no mutation. |
| 4 | Prepare the ext4 publish clone/environment. | Done | `ev:T-0418:d834f79b3a96479098c96d4d` |
| 5 | Record operator publish command, post-publish verification, and evidence expectations. | Done | `PUBLISH_OPERATOR_STEPS.md` |
| 6 | Stop before npm publish unless the operator provides authentication and explicit approval. | Blocked on operator | npm authentication and interactive `publish` confirmation required. |
