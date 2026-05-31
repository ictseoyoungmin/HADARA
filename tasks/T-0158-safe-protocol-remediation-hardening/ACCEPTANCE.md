# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Execute-mode remediation writes use temp-file/rename with rollback-attempt issue reporting. | Met | `src/services/protocol-remediation.ts`; focused regression test. |
| AC-2 | Execute-mode remediation detects planned-content conflicts before writing. | Met | `expectedBeforeHash`/`expectedBeforeExists`; focused regression test. |
| AC-3 | Project State profile remediation preserves existing Metadata table rows and following sections. | Met | Metadata upsert regression test. |
| AC-4 | Task Board row remediation warns/skips when the canonical table frame is missing. | Met | `TASK_BOARD_TABLE_FRAME_MISSING` regression test. |
| AC-5 | Decisions table-frame remediation warns/skips when a non-canonical decision table already exists. | Met | `DECISIONS_TABLE_FRAME_AMBIGUOUS` regression test. |
| AC-6 | Evidence and handoff are updated before completion. | Met | `EVIDENCE.md`, `evidence.jsonl`, `HANDOFF.md`, `docs/AGENT_HANDOFF.md`. |
