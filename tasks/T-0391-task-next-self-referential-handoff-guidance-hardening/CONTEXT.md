# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Compact session read-routing and operating rules. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next-step source. | Read |
| docs/TASK_BOARD.md | Task queue and newly created capsule row. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle and command semantics. | Read |
| docs/CLI_JSON_CONTRACT.md | `task next` JSON consumer contract. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Handoff can contain meta-guidance rather than a concrete work item. | Dogfood output from `task next --json`. | Agents may create nonsense capsules if meta-guidance is treated as work. |
| Development Slices and Task Board remain valid fallback sources. | Existing `task next` design and tests. | If fallback is skipped, no useful next work is produced. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `task next` remains read-only. | Workflow command contract. | No task or handoff mutation in this slice. |
| Handoff-first behavior stays intact for concrete work. | T-0239 policy. | Only self-referential `task next` guidance is filtered. |
| Additive docs only. | CLI JSON compatibility. | No schema breaking change. |
