# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 7.6 slice order and completion context. | Read |
| docs/specs/0.3.0/07_Phase_7_6_0_3_0_Release_Hardening_and_Installed_Package_Recycle.md | Task-specific acceptance and validation contract. | Read |
| docs/specs/0.3.0/implementation_guides/WORKER_AGENT_INSTRUCTIONS.md | Worker rules for Phase 7 implementation. | Read |
| docs/specs/0.3.0/implementation_guides/SPEC_AUTHORING_RULES.md | Spec/document authoring constraints. | Read |
| docs/specs/0.3.0/implementation_guides/README_UPDATE_INSTRUCTIONS.md | README update contract for Phase 7.6. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `0.3.0-rc.0` is a source candidate, not a published npm version. | Phase 7.6 spec and release readiness docs. | README/release notes would overclaim if published status were implied. |
| Release artifact execution needs a clean worktree. | `release artifact --execute` preflight behavior. | Requires a clean interim commit before final release dry-run evidence can be produced. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No publish mutation without explicit operator approval. | Phase 7.6 spec and AGENTS rules. | Only dry-run publish checks are allowed in this capsule. |
| Package/install validation should use the built `dist` refreshed from Docker. | `docs/IMPLEMENTATION_SOP.md` HADARA-dev CLI rule. | Docker sync build ran before package smoke and installed recycle. |
