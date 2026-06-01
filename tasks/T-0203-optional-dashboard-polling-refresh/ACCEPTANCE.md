# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Polling can be enabled/disabled without browser persistence. | Done | Toggle button and in-memory `pollingState`; tests assert no browser storage. |
| AC-2 | Polling reads through existing read-only refresh/bootstrap path. | Done | `runPollingRefresh()` calls `refreshStatus()` only. |
| AC-3 | Failure backoff prevents request spam. | Done | Degraded reads increment failures and multiply the next timeout delay. |
| AC-4 | No streaming, shell, provider, MCP, task, evidence, or release mutation is added. | Done | Static tests assert no SSE/WebSocket; no backend mutation paths added. |
| AC-5 | Validation evidence is attached. | Done | Docker sync-build evidence appended with 83 files / 561 tests and built CLI smoke `ok:true`. |
