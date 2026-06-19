# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Required session context anchor. | Read via repository startup context. |
| docs/PROJECT_STATE.md | Current project state and latest context-routing line summary. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and known residual performance notes. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read via AGENTS.md/session protocol. |
| docs/DEVELOPMENT_SLICES.md | Slice status for T-0385/T-0386/T-0387. | Read |
| docs/specs/0.3.3/context-routing/09_Context_Routing_Implementation_Completion_Audit.md | Primary readiness snapshot being aligned. | Read |
| docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md | C6 implementation status and residual performance boundary. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Cleanup capsule routing addendum. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0382/T-0383/T-0384 are complete and committed. | Task Board, Development Slices, and recent commits. | Readiness docs would incorrectly route already-completed cleanup as future work. |
| Mounted broad cache/graph/pack latency remains a residual, not a default Session Start blocker. | T-0373/T-0383/T-0384 measurements and diagnostics. | If treated as release-blocking without a new runtime plan, cleanup would stall despite bounded default behavior. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not change runtime/source behavior in this capsule. | T-0385 scope. | Docs/readiness cleanup only. |
| Preserve cache-is-not-truth and explicit-write boundaries. | Context-routing specs and AGENTS.md. | Completion wording must not imply hidden cache writes. |
| Route richer acceptance lifecycle semantics to T-0386. | User-approved 8-capsule plan and audit queue. | Avoid ad-hoc status parser expansion in a docs cleanup capsule. |
| Route final slice/pack boundary review to T-0387. | User-approved 8-capsule plan and audit queue. | Avoid mixing security audit changes into readiness docs. |
