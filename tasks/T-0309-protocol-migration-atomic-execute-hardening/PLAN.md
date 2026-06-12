# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and reviewer feedback. | Done | AGENTS/SOP/handoff/project state/rc.2 plan reviewed. |
| 2 | Fill capsule scope, acceptance, files, risks, and validation plan. | Done | Capsule docs updated before implementation. |
| 3 | Add common atomic text write helper. | Done | `src/core/fs.ts` |
| 4 | Harden `protocol migrate --execute` with preflight-all, prepare-all, commit-all, rollback-on-failure behavior. | Done | `src/services/protocol-migration.ts` |
| 5 | Harden `docs mark --execute` registry write with atomic temp+rename. | Done | `src/services/docs-cleanup.ts` |
| 6 | Shift rc.2 plan/roadmap numbering after T-0309. | Done | rc.2 plan and Development Slices updated. |
| 7 | Run focused validation, build/dist sync, smokes, evidence, and close. | In Progress | `ev:T-0309:59a8a94ad9e64595b2e71f50`; lifecycle close pending. |
