# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Package-smoke reports include explicit `networkPolicy` with default environment-inherited, non-enforced behavior. | Done | `package-smoke-dry-run` focused tests. |
| AC-2 | `--network-policy offline` applies Python best-effort offline command flags without claiming OS-level enforcement. | Done | Focused tests and built CLI smoke. |
| AC-3 | Python local package smoke can attach reduced public package-smoke evidence. | Done | `attaches reduced public Python package-smoke evidence when requested` unit test. |
| AC-4 | Python package-smoke evidence does not satisfy the npm release dry-run package smoke proof. | Done | `does not let Python package-smoke evidence satisfy the npm release gate` unit test. |
| AC-5 | Validation evidence is attached and handoff/docs are updated. | Done | Evidence `ev:T-0249:6e35da9cc97b45ac806b727d`; project state, slices, and handoff updated. |
