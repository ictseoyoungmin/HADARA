# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Doctor issues include additive safe-auto hints for existing allowlisted fixes. | Met | `suggestedFix` added for Task Board row, evidence JSONL, Decisions table frame, and Project State profile metadata issues. |
| AC-2 | Doctor report `remediations` includes safe-auto remediation objects mapped to current `protocol remediate --fix` commands. | Met | Protocol consistency tests assert generated safe-auto remediations. |
| AC-3 | Doctor commands remain read-only and execute still requires `protocol remediate --fix ... --execute`. | Met | Implementation only builds report objects; no doctor write path added. |
| AC-4 | Schema-valid output is preserved under `hadara.protocol.consistency.v1`. | Met | Focused tests validate reports against the existing schema fixture. |
| AC-5 | Evidence and handoff are updated. | Met | Evidence JSONL and handoff updated. |
