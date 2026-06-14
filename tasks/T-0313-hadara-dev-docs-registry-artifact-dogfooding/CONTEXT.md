# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Current-state routing points to docs registry artifacts. | Read |
| docs/PROJECT_STATE.md | Current rc.2/T-0312 state and next work. | Read |
| docs/AGENT_HANDOFF.md | Handoff-first recommendation for docs registry dogfooding. | Read |
| docs/TASK_BOARD.md | Task queue and T-0313 row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow and documentation timing rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close loop. | Read |
| Reviewer attachment | Exact scope and out-of-scope guidance for T-0313. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Committing `.hadara/docs-registry.json` and `docs/DOC_REGISTRY.md` is the correct HADARA-dev artifact policy. | T-0312 findings and reviewer guidance. | Low; this aligns context routing with committed source artifacts. |
| Existing service output should be used instead of hand-authoring a custom registry JSON shape. | Reviewer guidance and init/migration implementation. | Low; generated artifacts use the same seed/projection path as init. |
| `docs/DOC_REGISTRY.md` is a managed projection artifact and current seed behavior does not register the projection file itself as a registry entry. | `docs explain --path docs/DOC_REGISTRY.md` and service inspection. | Medium; avoid schema/seed changes in this capsule and carry forward only if operators want self-registration. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not run broad self-migration execute. | T-0312 and reviewer guidance. | `protocol migrate --target 0.3.0 --json` still plans unrelated project-wide writes. |
| Keep generated registry artifacts free of secrets and local paths. | AGENTS/SOP rules. | The seed contains repository-relative paths only. |
