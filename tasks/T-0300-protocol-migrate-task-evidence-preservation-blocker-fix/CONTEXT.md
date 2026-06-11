# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and rc.1 publish-deferred boundary. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and evidence requirements. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Required finish/ready/close/audit loop. | Read |
| Attached reviewer feedback | Defines the release-blocking evidence preservation bug. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Existing task `evidence.jsonl` content is append-only history and must be preserved byte-for-byte by protocol migration. | HADARA evidence integrity rules and reviewer feedback. | Data loss and invalid release readiness if migration rewrites evidence. |
| Missing `evidence.jsonl` creation is still useful for legacy capsules. | T-0299 migration scope. | Over-narrow fix could regress legacy task migration. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not hand-edit `evidence.jsonl`. | AGENTS / SOP. | Use canonical `evidence add-command` for new evidence only. |
| Do not publish rc.1 from this capsule. | User request and T-0300 scope. | Final readiness/publish remains a later capsule. |
