# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project, task workflow, release, and T-0339 spec docs. | Done | AGENTS, context, project state, handoff, task board, SOP, task workflow, development slices, 0.3.2 worker/spec docs, T-0339 spec, and release readiness read. |
| 2 | Correct the stale T-0338-active release-candidate status line. | Done | `docs/RELEASE_READINESS.md` now states installed-package recycle is complete through T-0338. |
| 3 | Run docs-only validation. | Done | `git diff --check` passed; targeted `rg` found the corrected T-0338 complete wording and no active wording. |
| 4 | Attach evidence. | Done | `ev:T-0339:c13115df6d8e471791753886` |
| 5 | Update handoff. | Done | Task-local handoff and `docs/AGENT_HANDOFF.md` updated for cleanup-complete/decision-next state. |
| 6 | Create a temporary HADARA-managed docker-compose backend/frontend dogfood project. | Done | `/tmp/hadara-dogfood-asteroid-ops` Asteroid Ops Drill project created. |
| 7 | Exercise HADARA init/task/evidence/status surfaces in the temporary project. | Done | T-0001 reached `closed-valid`; evidence `ev:T-0001:bf0cbeafd58e47ed9a53ee23`, close evidence `ev:T-0001:ff653fa5f1f34f218b0cc5c6`; T-0339 evidence `ev:T-0339:49cceff9e094481a85b7b4b0`. |
| 8 | Record structured dogfooding findings in `FINDINGS.md`. | Done | `FINDINGS.md` added; `ev:T-0339:49cceff9e094481a85b7b4b0`. |
| 9 | Decide stable publish, rc1, or deferral. | Done | Stable `0.3.2` publish selected in `DECISIONS.md` D-2. |
| 10 | Create next approval-gated stable publish capsule. | Done | T-0340 `Stable 0.3.2 Approval-Gated Publish` created. |
