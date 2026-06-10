# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read AGENTS, SOP, workflow docs, the manual publish helper, and the rc3 review. | Done | CONTEXT.md. |
| 2 | Confirm package metadata is publish-ready (name, version, private). | Done | name hadara, version 0.2.0-rc.3, private false. |
| 3 | Run package smoke `--execute` against current source in the Docker baseline. | Done | EVIDENCE.md; all steps passed. |
| 4 | Run clean-checkout smoke `--execute` in the Docker baseline. | Done | EVIDENCE.md; fresh npm ci + build + smoke. |
| 5 | Run release gate strict, release dry-run, release publish dry-run. | Done | EVIDENCE.md; ok, readiness ready, 0 blockers. |
| 6 | Confirm publish preconditions and document the exact operator steps. | Done | HANDOFF.md publish runbook. |
| 7 | Fill capsule docs and close honestly. | Done | finish/ready/close/audit-close. |
