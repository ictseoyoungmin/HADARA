# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and T-0317 carry-forward findings. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| `docs/specs/0.3.1/rc1/03_Installed_Package_Findings_Cleanup.md` | Defines Phase 8.3 scope and done criteria. | Read |
| `tasks/T-0317-stable-0-3-0-post-publish-installed-package-recycle/FINDINGS.md` | Source findings for exact npx ambiguity and governed docs doctor warning. | Read |
| `docs/TEST_STRATEGY.md` | Existing package/install validation boundaries. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Exact `npx` proof cannot be made deterministic in all workspaces. | T-0317 DNS/global PATH finding. | Low; document temp-prefix installed-bin as the canonical consumer proof. |
| Fresh governed docs doctor warning is avoidable. | Registry says `docs/REFACTOR_LOG.md` is historical and never-default. | Medium; update generated Required Reading and section-scoped docs doctor parsing. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No release mutation. | Phase 8.3 spec. | Do not run publish. |
| Network-dependent smoke is optional. | Phase 8.3 spec. | Required validation should be local/Docker reproducible. |
