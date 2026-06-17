# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle and evidence command semantics. | Read |
| docs/CLI_JSON_CONTRACT.md | JSON failure code and command contract surface. | Read |
| tasks/T-0330-phase-9-evidence-v2-writer-stabilization/HANDOFF.md | Stale handoff cleanup target. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0331 should not move release or large phase work forward until hardening is complete. | User review direction. | If skipped, release proof semantics could carry known split-brain risk. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not hand-edit `evidence.jsonl`; record validation through the evidence writer. | HADARA protocol. | Followed. |
| T-0330 is already closed; editing its handoff requires rerunning T-0330 ready/close/audit. | `docs/TASK_WORKFLOW_COMMANDS.md`. | T-0330 close proof will be refreshed after handoff cleanup. |
| Command evidence remains non-executing. | Existing evidence command boundary. | No shell execution surface added. |
