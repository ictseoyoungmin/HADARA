# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara package smoke --provider python --json` emits schema-valid dry-run planning with Python steps. | Done | Built CLI dry-run smoke. |
| AC-2 | Python local mode can run through an injected runner and reports reduced build/check/install steps. | Done | Unit test covers successful local mode with temp artifacts and cleanup. |
| AC-3 | PyPI token loading, publish, MCP execution, public raw logs, package contents, and private paths remain absent. | Done | Report privacy flags and tests. |
| AC-4 | Tests/evidence/handoff are updated. | Done | Evidence `ev:T-0248:294688aa29c849e48b9bee0c`; docs updated. |
