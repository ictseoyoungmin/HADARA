# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Published `hadara@0.3.0-rc.2` registry metadata and installed package execution are verified. | Met | T-0312 evidence records `command:T-0312:npm-registry-metadata` and `command:T-0312:published-package-execution`. |
| AC-2 | Fresh init/docs, protocol migration execute, and task finish row-preservation smokes pass from the installed package. | Met | T-0312 evidence records `command:T-0312:fresh-init-docs-smoke`, `command:T-0312:protocol-migrate-smoke`, and `command:T-0312:task-finish-row-preservation-smoke`. |
| AC-3 | README/release readiness drift is fixed and remaining findings are classified. | Met | README badge and `docs/RELEASE_READINESS.md` updated; `FINDINGS.md` records registry artifact and docs patch atomic follow-ups. |
| AC-4 | Evidence is attached. | Met | Six public command-log records appended to `EVIDENCE.md` and `evidence.jsonl`. |
| AC-5 | Handoff is updated. | Met | Task-local `HANDOFF.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, and `docs/DEVELOPMENT_SLICES.md` updated before close. |
