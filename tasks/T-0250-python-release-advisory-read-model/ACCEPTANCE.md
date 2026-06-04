# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Release dry-run emits `providerAdvisories` for Python with `status: preview`. | Done | Unit tests and built CLI smoke. |
| AC-2 | Python smoke evidence reports `present`, `missing`, or `stale`. | Done | `release-dry-run` unit tests. |
| AC-3 | Python advisory has `blocking:false` and does not affect release readiness. | Done | Stale advisory test keeps `report.ok: true`; Python evidence does not satisfy npm gate. |
| AC-4 | No Python primary target, PyPI token, upload, or publish behavior is added. | Done | Code remains read-only advisory; tests cover no release readiness coupling. |
| AC-5 | Evidence is attached and handoff/docs are updated. | Done | Evidence `ev:T-0250:d85f51ce078c4cb591c151b4`; project state, slices, and handoff updated. |
