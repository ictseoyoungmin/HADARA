# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `docs/AGENT_HANDOFF.md` no longer has stale T-0326/T-0325/T-0324-only `Last 3 Completed Tasks`; it reflects the latest cleanup plus T-0328 and T-0327. | Done | Targeted `rg` check; `ev:T-0329:7cf046ee6b4a4400b8d50912`. |
| AC-2 | `docs/RELEASE_NOTES.md` `0.3.1-rc.1` boundaries describe completed T-0326 readiness, T-0327 publish/dist-tag correction, and T-0328 installed-package recycle. | Done | Targeted `rg` check; `ev:T-0329:7cf046ee6b4a4400b8d50912`. |
| AC-3 | Shared state docs reflect T-0329 as the latest docs cleanup and route next work toward roadmap selection / Phase 9 evidence-quality work. | Done | `docs/PROJECT_STATE.md`, `docs/DEVELOPMENT_SLICES.md`, and `docs/AGENT_HANDOFF.md` updates; targeted `rg` check. |
| AC-4 | Focused documentation validation and canonical evidence are recorded. | Done | `git diff --check` passed; evidence `ev:T-0329:7cf046ee6b4a4400b8d50912`. |
