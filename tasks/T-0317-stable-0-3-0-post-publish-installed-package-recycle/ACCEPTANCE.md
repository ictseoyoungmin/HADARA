# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Published `hadara@0.3.0` registry visibility and package execution are verified. | Met with finding | Registry metadata and temp-prefix installed bin passed; exact `npx` check failed in this environment and is recorded in `FINDINGS.md`. |
| AC-2 | Fresh init/docs surfaces pass for `basic`, `standard`, and `governed` profiles from the installed package. | Met with warning | Basic/standard docs doctor clean; governed docs doctor `ok:true` with non-blocking historical Required Reading warning in `FINDINGS.md`. |
| AC-3 | Protocol migrate dry-run/execute, task finish preservation, and ready/close/audit mini lifecycle smokes pass from the installed package. | Met | `command:T-0317:migration-finish-lifecycle`. |
| AC-4 | Stable status is represented as publish complete and consumer recycle no longer pending after this task closes. | Met | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md`, and `docs/RELEASE_READINESS.md` updated. |
| AC-5 | Evidence is attached. | Met | Public command-log records in `EVIDENCE.md` and `evidence.jsonl` include registry/install proofs, the failed exact npx check, later classification evidence, README cleanup evidence, and close proof. |
| AC-6 | Handoff is updated. | Met | Task-local `HANDOFF.md` and `docs/AGENT_HANDOFF.md` updated. |
| AC-7 | README package-page release status and development-command scope are cleaned up. | Met | README Release Status now shows current stable, previous RC, and historical-reference row; HADARA-dev-only Docker/focused validation commands removed from README. |
