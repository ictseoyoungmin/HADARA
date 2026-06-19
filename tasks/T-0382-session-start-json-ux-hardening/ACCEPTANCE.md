# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Session Start JSON includes structured guidance metadata for primary next action and mode. | Met | `ev:T-0382:93c876280718445e833270ba` |
| AC-2 | `hadara session start --json` no-task bounded fallback is actionable and does not fail solely because no task id was supplied. | Met | Built CLI no-task smoke returned `ok:true`, `guidance.primaryNextAction:"select-task"`. |
| AC-3 | Read-only/no-hidden-scan behavior is preserved. | Met | Tests retain project snapshot/no-write assertions; no live path added to default. |
| AC-4 | Focused tests, schema validation, built CLI smoke, and diff hygiene pass. | Met | `ev:T-0382:93c876280718445e833270ba` |
| AC-5 | Evidence and handoff are updated. | Met | `ev:T-0382:93c876280718445e833270ba`; shared handoff points to T-0383. |
