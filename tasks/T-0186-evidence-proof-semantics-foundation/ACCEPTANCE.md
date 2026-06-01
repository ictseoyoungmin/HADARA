# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Existing `hadara.evidence.v1` records normalize into a semantic read-model shape without private path leakage. | Done | `tests/unit/evidence-normalizer.test.ts` passed. |
| AC-2 | Evidence category/outcome/strength classification covers validation, implementation, release, note, failed, blocked, weak, and ambiguous command-log cases. | Done | `tests/unit/evidence-semantics.test.ts` passed. |
| AC-3 | Task semantic analyzer reports Done blockers for note-only/weak evidence, unresolved failed evidence, and unexplained blocked evidence. | Done | `tests/unit/evidence-semantics.test.ts` passed. |
| AC-4 | Failed evidence resolution requires exact `supersedes:<id>` / `resolves:<id>` marker, later passed same-category evidence, or explicit residual-risk documentation. | Done | `tests/unit/evidence-semantics.test.ts` passed. |
| AC-5 | Release proof predicate accepts supported public release evidence and rejects arbitrary passed command logs. | Done | `tests/unit/evidence-semantics.test.ts` passed. |
| AC-6 | No evidence writer, `EVIDENCE.md`, init scaffold, MCP write, or release-gate enforcement behavior is changed. | Done | Diff limited to new foundation modules/tests and docs; Docker sync-build passed. |
| AC-7 | Required validation is run and evidence is attached through HADARA evidence commands. | Done | T-0186 focused and Docker sync-build evidence records. |
| AC-8 | Handoff/state docs are updated before close. | Done | PROJECT_STATE, DEVELOPMENT_SLICES, and AGENT_HANDOFF updated. |
