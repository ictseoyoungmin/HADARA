# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | In the current HADARA-dev workspace, `task next --json` does not make old T-0006 Partial work the primary recommendation while handoff names current work. | Met | Built CLI smoke returned `summary.source: docs/AGENT_HANDOFF.md`; T-0006 appeared only in `backlog`. |
| AC-2 | `hadara.task.next.v1` reports primary source/policy and distinguishes handoff, development-slice, and Task Board fallback recommendations. | Met | Focused task-next tests cover `summary.policy` and `sourceKind`. |
| AC-3 | Legacy incomplete Task Board rows remain visible as fallback/backlog data. | Met | Focused task-next tests and built CLI smoke show backlog rows. |
| AC-4 | Existing Development Slices and Task Board fallback behavior remains available when handoff has no actionable next direction. | Met | Existing task-next tests preserved planned slice and board fallback behavior. |
| AC-5 | Spec, project docs, evidence, and handoff are complete before the final finish/close/audit command loop. | Met | Spec/docs/evidence/handoff are current; final HADARA workflow commands can close the capsule without further content changes. |
