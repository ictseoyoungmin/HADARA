# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Compact current-state routing. | Read |
| `docs/PROJECT_STATE.md` | Current project state and Phase 8 boundary. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff, known problems, and validation baseline. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0325 row. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow, evidence, and close-source rules. | Read |
| `docs/TASK_WORKFLOW_COMMANDS.md` | Task lifecycle write boundaries and status token semantics. | Read |
| `docs/DEVELOPMENT_SLICES.md` | Phase 8 slice continuity. | Read |
| `docs/specs/0.3.1/` | Phase 8 status governance specs affected by the cleanup. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Task-local `HANDOFF.md` is part of close source, so storing post-close proof state there creates fixed-point drift. | Reviewer feedback; `task close` source hash model. | If false, a smaller value patch would be enough; current close-source rules confirm it is true. |
| `CloseState` should remain visible through read models, not disappear from operator output. | Phase 8 status governance intent. | Operators still need close proof visibility after handoff field removal. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `task close --execute` may append close evidence only. | `docs/TASK_WORKFLOW_COMMANDS.md` | Do not solve this by making close mutate HANDOFF.md. |
| Do not hand-edit `evidence.jsonl`. | AGENTS.md / SOP | Use `evidence add-command` for validation records. |
| Recent closed task handoff edits can stale old close proofs. | Close-source hash semantics | This task intentionally fixes current visible drift; authoritative current closure will be T-0325. |
