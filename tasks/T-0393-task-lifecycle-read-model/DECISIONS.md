# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Compose `task lifecycle` from existing finish, ready, close, and audit-close read models. | Accepted | This keeps the new API aligned with canonical lifecycle behavior and avoids duplicate validation logic. | `src/task/task-lifecycle.ts` |
| D-2 | Keep `task lifecycle` read-only and expose only one primary next action. | Accepted | Agents need a normalized phase without hidden status/evidence/shared-doc writes. | `ev:T-0393:03d977cfde444c83862cfd3c` |
| D-3 | Include minimal repair metadata in T-0393 but defer dedicated close-repair classification tests to T-0394. | Accepted | T-0393 proves the general phase API; T-0394 owns stale/invalid/not-closed repair plan behavior. | `docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md` |
