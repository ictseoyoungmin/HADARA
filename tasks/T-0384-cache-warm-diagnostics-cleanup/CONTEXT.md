# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Compact current-state routing and operating rules. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and T-0384 routing. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close command semantics. | Read |
| docs/specs/0.3.3/context-routing/09_Context_Routing_Implementation_Completion_Audit.md | Cleanup queue and residual diagnostics purpose. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Additive JSON is acceptable for cache report hardening. | Existing schemas use `additionalProperties:true`. | Breaking required fields would be unnecessary risk. |
| Mounted slowness still needs separate performance work. | T-0383 full-profile probes and T-0373 baseline. | Diagnostics alone may not reduce latency. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `context cache status` and dry-run warm must remain non-mutating. | Cache-is-not-truth / explicit warm boundary. | Diagnostics recommend `warm --execute` but do not execute it. |
| Avoid writing local cache during validation. | Portable/project store boundary. | Built smoke only read status output. |
