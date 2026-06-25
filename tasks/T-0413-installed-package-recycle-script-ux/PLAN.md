# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and 0.3.4 Agent UX spec. | Done | `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md` |
| 2 | Implement dry-run-first installed-package recycle command and report. | Done | `src/services/package-recycle.ts`, `src/cli/package-smoke.ts` |
| 3 | Register schema, command metadata, docs, and tests. | Done | `hadara.packageRecycle.v1`, `package.recycle`, docs/tests updates |
| 4 | Run focused validation and built CLI dry-run smoke. | Done | ev:T-0413:db037677d84640d39722a7c7 |
| 5 | Update capsule/shared docs before finalize. | Done | T-0413 capsule docs, Task Board, Project State, Agent Handoff |
