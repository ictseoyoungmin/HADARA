# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Treat PF-F-012 as a source-release hardening item before stable. | Accepted | Dogfood found context pack state projection false warnings, which affects context-routing trust. | `artifacts/patternforge/STABLE_0_3_3_DECISION_INPUT.md` |
| D-2 | Treat PF-F-010 as next-action classification hardening, not close proof invalidation. | Accepted | Closed-valid tasks should still allow audit, but warning-only handoff drift should not be a required post-close edit. | `src/services/workbench-next-actions.ts` |
