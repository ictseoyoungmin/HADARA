# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara init --profile basic|standard|governed` creates `.hadara/context/HADARA_CONTEXT.md`. | Done | Focused init tests and built three-profile smoke. |
| AC-2 | Fresh init `doctor`, `docs list`, `docs doctor`, and `docs required-reading` surfaces recognize the context document. | Done | Built three-profile smoke and docs registry/required-reading tests. |
| AC-3 | Project-scoped `protocol migrate --target 0.3.0` plans missing context creation and preserves existing context. | Done | Protocol migration tests and built migration dry-run smoke. |
| AC-4 | Task-scoped migration does not create or modify project context. | Done | Protocol migration task-scope test. |
| AC-5 | HADARA-dev docs register the rc.2 plan and planned T-0303 through T-0308 slices. | Done | SOP Required Reading and DEVELOPMENT_SLICES updates. |
| AC-6 | Evidence is attached and handoff is updated before close. | Done | `evidence add-command` recorded validation evidence; task and project handoff docs updated. |
