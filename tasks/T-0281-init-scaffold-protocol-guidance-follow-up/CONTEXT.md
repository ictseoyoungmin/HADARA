# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and T-0280 baseline. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next-step guidance. | Read |
| docs/TASK_BOARD.md | Task queue and T-0281 capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules, generated-doc structure, evidence records, and document-registration protocol. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Current lifecycle semantics and command boundaries. | Read |
| Active T-0281 capsule docs | Task-local scope and validation frame. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Generated docs should stay concise. | User request and init UX review. | Over-explaining could make basic scaffolds noisy. |
| `harness validate` should remain a diagnostic, not return to the standard close loop as a separate required step. | T-0166 through T-0170 lifecycle model and direct CLI smoke. | Reintroducing it as a required loop step would duplicate `task ready`/`task close` checks. |
| Multi-language ignore rules are safer for default scaffolds than Node-only ignore rules. | Bookmark API experiment feedback. | Without them, venv/cache/SQLite artifacts can pollute generated repos. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve generated profile boundaries. | T-0279/T-0280 init lifecycle work. | Do not add governed-only docs to basic scaffolds. |
| Keep evidence safety explicit. | HADARA protocol anti-false-completion goal. | Generated SOP/AGENTS must discourage hand editing and optimistic evidence summaries. |
