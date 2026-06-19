# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Compact current-state routing and operating rules. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next task. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close command semantics. | Read |
| docs/specs/0.3.3/context-routing/09_Context_Routing_Implementation_Completion_Audit.md | Residual context-routing cleanup queue and T-0383 purpose. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Mounted workspace broad graph/cache/pack reads can exceed a short smoke timeout. | T-0373/T-0380 performance work and direct T-0383 probes. | A default full smoke would hang operator loops. |
| Built CLI `dist/` is current from T-0382 validation. | T-0382 sync-build evidence and smoke output. | If stale, script validation could test old behavior. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Normal smoke commands must be read-only or dry-run and must not update `.hadara/local/cache/context`. | Context-routing cache contract and T-0381 audit. | Script fingerprints the context cache before/after. |
| Extended graph/cache/pack workload coverage must be explicit. | Mounted performance observations. | `--profile full` and `--workloads` provide opt-in coverage. |
