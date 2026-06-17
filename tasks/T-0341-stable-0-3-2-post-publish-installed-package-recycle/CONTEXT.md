# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Repository-level HADARA protocol and task workflow requirements. | Read |
| .hadara/context/HADARA_CONTEXT.md | Current-state routing anchor. | Read |
| docs/PROJECT_STATE.md | Confirms T-0340 stable publish complete and stable recycle next. | Read |
| docs/AGENT_HANDOFF.md | Current handoff names post-publish installed-package recycle as next. | Read |
| docs/TASK_BOARD.md | Task queue and new T-0341 row source. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, validation, and documentation timing rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit and evidence add-command semantics. | Read |
| docs/DEVELOPMENT_SLICES.md | Release-line slice ordering and current completion evidence. | Read |
| docs/specs/0.3.2/02_Worker_Agent_Instructions.md | 0.3.2 line boundaries and release/recycle policy. | Read |
| docs/specs/0.3.2/00_Evidence_v2_Refactor_Release_Design.md | Evidence v2 exact id/resolution contract and recycle acceptance. | Read |
| docs/specs/0.3.2/capsules/T-0338_0_3_2_rc0_Post_Publish_Installed_Package_Recycle.md | Stable T-0341 should repeat this installed-package recycle shape for `0.3.2`. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara@latest` should resolve to `0.3.2` after T-0340. | T-0340 evidence and reviewer instruction. | Installed-package proof fails and must be recorded as release-line blocker. |
| Temp-prefix installed bin is the primary proof in this local environment. | T-0338 handoff warning about stale exact `npx` shim behavior. | Source checkout or `npx` could report a stale local/global package. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not publish or mutate registry tags. | T-0341 scope. | This is verification-only after T-0340. |
| Do not hand-edit `evidence.jsonl`. | AGENTS / workflow docs. | Use `evidence add-command` for task evidence. |
| Use durable `ev:` ids for exact resolution workflow. | 0.3.2 Evidence v2 design. | Legacy compatibility ids are inspection-only. |
