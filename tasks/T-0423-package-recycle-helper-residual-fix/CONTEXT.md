# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Repository HADARA protocol rules. | Read |
| .hadara/context/HADARA_CONTEXT.md | Compact current-state routing. | Read |
| docs/PROJECT_STATE.md | Current project and release-line state. | Read |
| docs/AGENT_HANDOFF.md | Current known problem and next task routing. | Read |
| docs/TASK_BOARD.md | Task queue and T-0423 capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, docs timing, Docker validation requirements. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Close/finalize and close-source drift rules. | Read |
| docs/DEVELOPMENT_SLICES.md | 0.3.4 release slice ordering. | Read |
| docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md | Package trust and installed-package recycle workstream. | Read |
| tasks/T-0422-0-3-4-rc-0-post-publish-installed-package-recycle/* | Residual evidence and continuity cleanup context. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Default package recycle should prioritize installed-agent UX path over broad graph reads. | Reviewer direction and T-0422 residual. | Helper may keep failing stable readiness for avoidable broad reads. |
| Broad graph recycle can be opt-in without weakening package trust. | T-0422 manual acceptance and Agent UX scope. | If stable readiness requires graph by default, this design would need reconsideration. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve failed evidence; do not hide T-0422 helper failures. | HADARA evidence rules. | T-0423 fixes source behavior while T-0422 failed helper artifacts remain authoritative. |
| Do not publish or mutate npm tags. | T-0423 scope. | Validation may install `hadara@next`, but no publish mutation is allowed. |
