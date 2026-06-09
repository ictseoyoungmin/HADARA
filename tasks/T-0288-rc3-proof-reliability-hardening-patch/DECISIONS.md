# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Strict CI gate with empty scope is a blocker unless `--allow-empty`. | Accepted | A strict gate that validates nothing must not pass; `--allow-empty` is the explicit bootstrap escape hatch. | ci gate built smoke. |
| D-2 | Unknown `--task` is a gate-level `CI_GATE_TASK_NOT_FOUND` blocker. | Accepted | The gate should state task absence directly, not rely only on the protocol report. | ci gate built smoke. |
| D-3 | Proof `checkedSources` reuses the close-relevant source set. | Accepted | Freshness is derived from the close audit source hash; the reported sources must match those inputs. | proof status built smoke. |
| D-4 | Stale lock recovery stays manual with diagnostics, not auto-removal. | Accepted | Auto-removing another process's lock risks clobbering a live writer; diagnosable fail-closed is safer for rc3. | evidence.ts timeout message + lock.json. |
| D-5 | Crash-atomic evidence append is deferred to a follow-up capsule. | Accepted | The lock removes interleaving; full journaling is a larger change out of this patch's scope. | RISKS.md residual risk. |
