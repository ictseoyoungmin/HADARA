# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Project-local context anchor and routing guide. | Read |
| `docs/PROJECT_STATE.md` | Current project state and latest completed T-04A2 scaffold implementation. | Read |
| `docs/AGENT_HANDOFF.md` | Current handoff and T-04A3 next-step guidance. | Read |
| `docs/TASK_BOARD.md` | Task queue and T-0429 capsule path. | Read |
| `docs/specs/0.4.0/productization-redesign/02_Agent_Entry_and_Workflow_Document.md` | Authoritative T-04A3 role split and workflow template requirements. | Read |
| `docs/specs/0.4.0/productization-redesign/templates/0.4/AGENTS.md` | Accepted 0.4 AGENTS template content. | Read |
| `docs/specs/0.4.0/productization-redesign/templates/0.4/HADARA_WORKFLOW.md` | Accepted 0.4 workflow template content. | Read |
| `docs/specs/0.4.0/productization-redesign/templates/0.4/HADARA_CONTEXT.md` | Accepted 0.4 context template content. | Read |
| `src/cli/init.ts` | Current generated AGENTS and workflow templates. | Read |
| `src/services/docs-registry.ts` | Current generated HADARA_CONTEXT template. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-04A3 can directly align generated templates to the registered 0.4 template docs. | `02_Agent_Entry_and_Workflow_Document.md` and ponytail review. | If templates have unregistered edits, tests may need targeted assertions rather than exact full-file equality. |
| Registry command redesign remains deferred. | Worker plan assigns it to T-04A4. | Generated workflow can mention `docs register`, but command behavior will be implemented later. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| `AGENTS.md` must not contain lifecycle/finalize/context pack recipes or full validation command lists. | `02_Agent_Entry_and_Workflow_Document.md` | Keep detailed command guidance in `docs/HADARA_WORKFLOW.md`. |
| `.hadara/context/HADARA_CONTEXT.md` must not duplicate Required Reading or workflow tables. | `02_Agent_Entry_and_Workflow_Document.md` | It should route only. |
| `docs/HADARA_WORKFLOW.md` must include read authority, lifecycle entry gate, evidence truthfulness, finalize dry-run review, failure modes, read maps, and authoring model. | `02_Agent_Entry_and_Workflow_Document.md` | Focused tests should cover these sections. |
