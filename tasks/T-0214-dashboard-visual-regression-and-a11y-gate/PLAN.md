# Plan

| Step | Status | Evidence |
|---|---|---|
| Write the visual+a11y harness with stubbed read-only APIs. | Done | dashboard/visual-check.mjs. |
| Add the Docker runner and commit fixtures. | Done | scripts/dashboard-visual-check.sh; dashboard/visual-fixtures/*. |
| Rewrite dashboard-static.test.ts for new-design invariants + source scan. | Done | tests/unit/dashboard-static.test.ts. |
| Run the full Docker suite and the visual gate. | Done | 84 files / 562 tests; visual+a11y all pass. |
