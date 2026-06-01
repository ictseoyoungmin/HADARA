# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Public docs define planned `hadara.evidence.v2` persisted record shape. | Done | `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md` |
| AC-2 | Migration plan is dry-run-first, per-task first, hash-guarded, and mixed-version tolerant. | Done | Docs regression test. |
| AC-3 | Plan explicitly forbids automatic `evidence.jsonl`/`EVIDENCE.md` rewrite, init changes, MCP writes, UI work, and release enforcement in this slice. | Done | Docs regression test. |
| AC-4 | Schema and test strategy docs reference the v2 plan and future validation requirements. | Done | Docs regression test. |
| AC-5 | Focused docs regression and full Docker validation run. | Done | T-0190 evidence records. |
| AC-6 | Handoff/state docs are updated before close. | Done | PROJECT_STATE, DEVELOPMENT_SLICES, AGENT_HANDOFF. |
