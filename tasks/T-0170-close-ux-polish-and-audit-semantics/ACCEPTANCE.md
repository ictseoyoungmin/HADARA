# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `validatedBeforeCloseEvidenceReportHash` is the primary diagnostic report hash and a separate close-relevant source hash is available. | Met | `TaskCloseReport.validation` exposes report/source hashes; deprecated alias remains additive. |
| AC-2 | Execute-mode close success nextActions report completed append plus optional audit, not preflight checks as required next work. | Met | `task-close` unit tests assert execute success actions are `close-evidence-appended` and `audit-close`. |
| AC-3 | Close evidence append result reports canonical Markdown and JSONL evidence paths. | Met | Execute unit test asserts `markdownPath` and `evidencePath`. |
| AC-4 | `hadara task audit-close --task <id> --json` audits close evidence and drift without writing. | Met | Audit unit tests cover success, missing close evidence, and source-hash drift warning. |
| AC-5 | Schema/docs/evidence/handoff are updated. | Met | Schema fixture registered; docs and capsule files updated; validation evidence recorded. |
