# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Repository-level HADARA protocol rules. | Read |
| docs/PROJECT_STATE.md | Current project state and remediation capability baseline. | Read |
| docs/AGENT_HANDOFF.md | Current handoff, validation constraints, and next planned slice. | Read |
| docs/TASK_BOARD.md | Task queue and new capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules, Docker validation path, and session-end requirements. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 2 slice ordering and current remediation/contract sequence. | Read |
| docs/ARCHITECTURE.md | Confirms remediation is within CLI/service state-store boundaries. | Read |
| docs/TEST_STRATEGY.md | Confirms Docker is the primary validation path. | Read |
| docs/SECURITY_MODEL.md | Confirms write-boundary and secret-safety invariants. | Read |
| docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md | Defines safe remediation boundaries and JSON contract follow-up. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `T-0158 Safe Protocol Remediation Hardening` can occupy the next task number. | `hadara task create` assigned T-0158 before the planned JSON contract capsule existed. | Planning docs must move Protocol Consistency JSON Contract to the next task number. |
| Remediation hardening should remain bounded to the existing four fixes. | User request and T-0157 scope. | Adding broad Markdown rewriting would exceed the capsule. |
| Warning-and-skip is safer than best-effort insertion for malformed existing tables. | User review notes. | Operators may need a later dedicated table-frame remediation for malformed Task Board files. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Dry-run-first remediation must remain the default. | T-0157 and Phase 2 spec. | Execute still requires `--execute`. |
| No destructive command use. | AGENTS / SECURITY_MODEL. | No deletes except cleanup of remediation temp files created by this command. |
| Docker validation is the baseline. | AGENT_HANDOFF / TEST_STRATEGY. | Host Node/npm remains unreliable. |
| Schema registration remains separate. | PROJECT_STATE / DEVELOPMENT_SLICES. | Report shape hardening happens before contract fixtures. |
