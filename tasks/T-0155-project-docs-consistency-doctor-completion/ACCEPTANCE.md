# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `protocol doctor` rejects simultaneous `--task` and `--scope`. | Met | Built CLI mutual-exclusion smoke returned `CLI_OPTION_INVALID_VALUE` and exit 1. |
| AC-2 | Docs-scope doctor reports mixed profile doc-set drift strongly enough to expose missing standard/governed docs. | Met | Focused protocol consistency test covers `PROFILE_DOC_SET_MIXED` plus missing profile docs. |
| AC-3 | Docs-scope doctor checks Project State current/latest task consistency and semantic AGENT_HANDOFF current-state fields. | Met | Focused test covers `PROJECT_STATE_ACTIVE_TASK_STALE` and `PROJECT_HANDOFF_ACTIVE_TASK_STALE`; existing stale latest-completed test remains. |
| AC-4 | Docs-scope doctor checks Development Slices row/status evidence drift against Task Capsules. | Met | Focused test covers `DEVELOPMENT_SLICE_STATUS_DRIFT`. |
| AC-5 | Docs-scope doctor checks Decisions evidence table sanity, Test Strategy validation baseline, and SOP scaffold structure drift. | Met | Focused test covers `DECISION_EVIDENCE_MISSING`, `TEST_STRATEGY_VALIDATION_BASELINE_STALE`, `SOP_SCAFFOLD_SECTION_MISSING`, and `SOP_REQUIRED_READING_TABLE_MISSING`. |
| AC-6 | Focused Docker tests, full Docker check, built CLI smokes, and done-level harness are recorded. | Met | Evidence records include focused tests, full check, built CLI smokes, and done-level harness. |
