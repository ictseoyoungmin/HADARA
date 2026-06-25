# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Pre-publish registry verification proves `hadara@0.3.4-rc.0` is absent and current dist-tags are understood before publish. | Met | `ev:T-0418:847b8df0510f4010a451a67a` |
| AC-2 | Publish dry-run/readiness passes without npm publish, GitHub Release creation, Docker/PyPI publish, installer execution, MCP release/package execution, or token value exposure. | Met | `ev:T-0418:5050dfc2b6694a3195d8d29a` |
| AC-3 | The operator publish environment and exact command for npm `next` publish are documented. | Met | `ev:T-0418:d834f79b3a96479098c96d4d`, `PUBLISH_OPERATOR_STEPS.md` |
| AC-4 | If the operator publishes during this capsule, npm view and dist-tags are verified and evidence is attached; otherwise the capsule remains blocked/pending on external authentication. | Blocked on operator | npm authentication and interactive publish confirmation required. |
