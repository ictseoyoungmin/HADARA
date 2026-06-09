# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Protocol entry point and rules. | Read |
| docs/AGENT_HANDOFF.md | Current state after T-0287 rc3 readiness. | Read |
| docs/TASK_BOARD.md | Task queue and capsule paths. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Standard task loop and command semantics. | Read |
| docs/specs/rc3-proof-reliability/04_RC3_Readiness_and_Recycle.md | rc3 readiness/recycle scope. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The append lock (mkdir-based) is the cross-process serialization point. | src/evidence/evidence.ts | If filesystem mkdir is non-atomic on a target FS, concurrency guarantees weaken. |
| Close-relevant source set in task-close is the right freshness input set. | src/task/task-close.ts hashCloseRelevantSource | If the close hash inputs change, proof checkedSources should follow the same source. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not commit in this session. | Operator instruction | More changes may follow; leave the capsule In Progress. |
| Proof/CI gate surfaces stay read-only. | TASK_WORKFLOW_COMMANDS.md | Hardening must not add writes to read-only reports. |
| Lock metadata must stay machine-local. | .gitignore `.hadara/local/` | lock.json carries pid and must not be committed. |
