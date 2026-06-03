# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Make the canonical evidence writer emit v2 by default in this MVP. | Accepted | Persisted IDs are only useful if new evidence gets them immediately; opt-in mode would leave the active task workflow on unstable legacy IDs. | `appendEvidenceRecord()` writes `hadara.evidence.v2`; T-0233 self-evidence is v2. |
| D-2 | Preserve v1 compatibility metadata under `legacy`. | Accepted | Existing gates and release semantics still speak in terms of `kind`, `result`, and optional evidence path. | Harness, lint, task close, dashboard, and workbench consumers read v2 legacy fields. |
| D-3 | Keep `EVIDENCE.md` unchanged. | Accepted | The human Markdown table should remain append-only and readable; richer Markdown frames belong in a separate dry-run-first capsule. | Out of scope and risk notes. |
| D-4 | Do not migrate existing evidence in this capsule. | Accepted | Migration needs per-task dry-run/execute guards and before-hash reporting. | `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md`; no historical JSONL rewrite. |
| D-5 | Harden the task lifecycle gates as part of the writer MVP. | Accepted | A writer change that cannot close its own capsule would be operationally unsafe. | T-0233 passes ready/finish/close/audit using v2 evidence. |
