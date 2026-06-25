# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and 0.3.4 Agent UX spec. | Done | `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md` |
| 2 | Implement read-only stale known-problem report, schema, CLI routing, and registry entry. | Done | `src/handoff/handoff-stale-problems.ts`, `src/cli/handoff.ts`, `src/schemas/handoff-stale-problems.schema.json` |
| 3 | Run validation. | Done | `ev:T-0409:50fc016e8af6435ba6fa7838`, `ev:T-0409:733b5dd43ab7400ab1e77e87` |
| 4 | Attach evidence. | Done | `tasks/T-0409-handoff-stale-known-problem-detector/EVIDENCE.md`, `tasks/T-0409-handoff-stale-known-problem-detector/evidence.jsonl` |
| 5 | Update handoff and shared state docs. | Done | `docs/AGENT_HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/TASK_BOARD.md`, `docs/DEVELOPMENT_SLICES.md` |
