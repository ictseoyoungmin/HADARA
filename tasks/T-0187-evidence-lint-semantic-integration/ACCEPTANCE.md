# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara.evidence.lint.v1` remains the evidence lint schema version and existing lint checks continue to work. | Done | Focused evidence-lint tests and Docker sync-build passed. |
| AC-2 | Evidence lint reports include additive `summary.semantics` for valid evidence records without exposing normalized records as a new top-level payload. | Done | `tests/unit/evidence-lint.test.ts` passed. |
| AC-3 | Done tasks with note-only/weak evidence produce semantic lint errors. | Done | `tests/unit/evidence-lint.test.ts` passed. |
| AC-4 | Done tasks with unresolved failed evidence produce semantic lint errors, and free-text resolution words are not accepted. | Done | `tests/unit/evidence-lint.test.ts` passed. |
| AC-5 | Done tasks with unexplained blocked evidence produce semantic lint errors. | Done | `tests/unit/evidence-lint.test.ts` passed. |
| AC-6 | Done tasks with substantive passed validation or implementation evidence do not receive semantic blockers. | Done | `tests/unit/evidence-lint.test.ts`, `tests/unit/task-ready.test.ts`, and `tests/unit/task-close.test.ts` passed. |
| AC-7 | Done tasks with private-only substantive evidence receive a warning, not an error. | Done | `tests/unit/evidence-lint.test.ts` passed. |
| AC-8 | Required validation is run and evidence is attached through HADARA evidence commands. | Done | T-0187 evidence records. |
| AC-9 | Handoff/state docs are updated before close. | Done | PROJECT_STATE, DEVELOPMENT_SLICES, AGENT_HANDOFF. |
