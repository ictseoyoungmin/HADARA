# Risks

| Risk | Mitigation |
|---|---|
| Lightweight validator diverges from full JSON Schema semantics. | Limit scope to the fixture keywords currently used and test the active-run schemas directly. |
| Runtime validation turns malformed local state into crashes. | Preserve `safeCreateActiveRunProjection` degraded warning behavior and verify degraded reports pass validation. |
| Broad schema enforcement blocks unrelated surfaces too early. | Restrict runtime enforcement in this capsule to active-run projection/resume reports only. |
