# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `protocol remediate --fix` as the only execution surface. | Accepted | T-0162 closes AC-6 hint visibility without introducing ambiguous issue-id writes. | Focused tests passed. |
| D-2 | Add `suggestedFix` as an additive issue field. | Accepted | Existing `remediationId` is already used for manual profile guidance, so safe-auto hints need a separate optional field. | Schema-valid tests passed. |
