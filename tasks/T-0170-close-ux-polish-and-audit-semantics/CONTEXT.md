# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and close-model follow-up status. | Read |
| docs/AGENT_HANDOFF.md | Current handoff, validation baseline, and Docker workflow caveats. | Read |
| docs/TASK_BOARD.md | Task queue and capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and evidence requirements. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and status update target. | Read |
| docs/SCHEMAS.md | Schema fixture posture and registry notes. | Read |
| docs/V1_0_IMPLEMENTATION_SCHEMAS.md | Close validation/evidence fixed-point redesign context. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The old `validatedBeforeCloseEvidenceHash` is a diagnostic report hash. | Reviewer caveat and current implementation. | Naming can imply file-state hashing if not clarified. |
| Close evidence append should not be part of the same pre-close fixed-point loop. | T-0165 through T-0169 design. | Re-running lint after append can create unnecessary loop semantics. |
| Audit can be read-only and warning-oriented for drift. | User request. | Treating drift warnings as blockers would make historical audits too brittle. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve additive JSON compatibility. | Schema fixture posture. | Keep deprecated hash alias and allow additional properties. |
| Do not auto-close docs/status rows. | Close MVP boundary. | This capsule only reports and audits close evidence. |
| Use Docker validation. | AGENT_HANDOFF / SOP. | Host workspace lacks `node_modules`; refresh built output before CLI smokes. |
