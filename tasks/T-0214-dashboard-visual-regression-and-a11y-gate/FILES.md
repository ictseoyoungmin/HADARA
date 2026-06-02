# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `dashboard/visual-check.mjs` | Added | Playwright screenshot baselines + axe-core a11y with stubbed read-only APIs. | Done |
| `scripts/dashboard-visual-check.sh` | Added | Docker (Playwright image) runner for the visual/a11y gate. | Done |
| `dashboard/visual-fixtures/bootstrap.json` | Added | Deterministic bootstrap fixture for visual capture. | Done |
| `dashboard/visual-fixtures/task-detail.json` | Added | Deterministic task-detail fixture for visual capture. | Done |
| `tests/unit/dashboard-static.test.ts` | Modified | New-design invariants + authored-source scan; governance/server tests preserved. | Done |
| `.gitignore` | Modified | Ignore generated .dashboard-visual/ screenshot output. | Done |
