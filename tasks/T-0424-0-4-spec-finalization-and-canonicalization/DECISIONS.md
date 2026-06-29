# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep authoring ownership guidance in `docs/HADARA_WORKFLOW.md` and registries, not repeated inside every generated Task Capsule. | Accepted | Avoids boilerplate drift and keeps capsules focused on actual task content. | 0.4 workflow and task capsule specs |
| D-2 | Exclude task-local `HANDOFF.md` raw file hash from the default close-source contract. | Accepted | Handoff is continuation guidance and should be clarifiable after close without staling task proof. | 0.4 close-source and handoff specs |
| D-3 | Make CLI automatic writing deterministic/projection-oriented and keep task-specific prose as agent-authored. | Accepted | Reduces documentation labor without silent semantic mutation. | 0.4 workflow and CLI contract specs |
| D-4 | Keep T-0424 as design-only and defer Required Reading/docs-registry registration to T-04A1. | Accepted | Matches operator instruction and avoids premature registry churn. | T-0424 scope |
