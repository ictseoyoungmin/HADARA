# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Proof status renders as a single tone-colored verdict word with supporting counts and a drill link. | Done | Visual gate proof verdict on selection; detail capture SUFFICIENT. |
| AC-2 | Private-only stays an auditability warning, not a Done blocker. | Done | proof.auditabilityWarning -> warning banner; HTML contains "auditability warning". |
| AC-3 | Consumes the task_detail proof summary; no raw evidence parsing in the frontend. | Done | normalizeTaskDetail reads proof/evidenceList only. |
