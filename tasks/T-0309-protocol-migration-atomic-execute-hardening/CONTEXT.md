# Context

Reviewer feedback after T-0308 identified two rc.2 hardening issues:

- `protocol migrate --execute` currently writes planned actions one by one; a later conflict or write failure can leave earlier files already renamed.
- `docs mark --execute` validates the registry before-hash but writes `.hadara/docs-registry.json` by direct overwrite.

This capsule treats both as T-0309 so rc.2 readiness can run after migration/adoption write semantics are stronger. Existing release readiness and post-publish recycle tasks move to T-0310 and T-0311 in planning docs.

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Pending |
| docs/AGENT_HANDOFF.md | Current handoff. | Pending |
| docs/TASK_BOARD.md | Task queue and status. | Pending |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Pending |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| TBD | TBD | TBD |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| TBD | TBD | TBD |
